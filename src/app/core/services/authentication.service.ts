import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserContext } from '../models/user-context.model';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    tenantId: number;
    fullName?: string;
    name?: string;
    permissions?: string[];
  };
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  tenantId: number;
  fullName?: string;
  name?: string;
  permissions?: string[];
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = `${environment.apiUrl}/auth`;  // base for NEW endpoints
  private storageKey = 'aiw_user_context';
  private currentUserSubject = new BehaviorSubject<UserContext | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Login with NEW role-specific endpoints
   */
  login(
    role: 'Admin' | 'Customer' | 'EndUser',
    email: string,
    password: string,
    tenantId?: number
  ): Observable<UserContext> {

    let url = '';

    // 🔥 Decide which backend login endpoint to hit
    switch (role) {
      case 'Admin':
        url = `${this.apiUrl}/admin/login`;
        break;

      case 'Customer':  // Tenant Owner
        url = `${this.apiUrl}/tenant/login`;
        break;

      case 'EndUser':
        url = `${this.apiUrl}/site/login`;
        break;
    }

    const payload: any = { email, password };
    if (tenantId) payload.tenantId = tenantId;

    return this.http.post<LoginResponse>(url, payload).pipe(
      map(response => {
        const decoded = this.decodeToken(response.token);

        const userContext: UserContext = {
          role: decoded.role as 'Admin' | 'Customer' | 'EndUser',
          tenantId: Number(decoded.tenantId),
          email: decoded.email,
          fullName: decoded.fullName || decoded.name || email,
          token: response.token,
          expiration: decoded.exp * 1000
        };

        this.saveUserContext(userContext);
        this.currentUserSubject.next(userContext);
        return userContext;
      })
    );
  }

  /**
   * Logout with role-based redirect
   */
  logout(redirectPath?: string): void {
    // Check if user is preview user before logout
    const user = this.getCurrentUser();
    const isPreviewUser = user ? Number(user.tenantId) === 5 : false;
    
    // Save last route before logout
    localStorage.setItem("lastRoute", this.router.url);
    
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);

    // Handle redirect
    if (redirectPath) {
      this.router.navigateByUrl(redirectPath);
      return;
    }

    // If preview user, redirect back to template preview
    if (isPreviewUser) {
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute && (lastRoute.includes('/template-selected') || lastRoute.includes('/template-preview'))) {
        this.router.navigateByUrl(lastRoute);
        return;
      }
      // Try to get template info from draft service
      const templateId = localStorage.getItem('aiw_template_id');
      const templateSlug = 'restaurant-menu'; // Default slug
      if (templateId) {
        this.router.navigate(['/template-selected'], { queryParams: { id: templateId, slug: templateSlug } });
        return;
      }
    }

    // Restore last route after logout
    const last = localStorage.getItem("lastRoute");
    this.router.navigateByUrl(last || '/templates');
  }

  getCurrentUser(): UserContext | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (user.expiration && user.expiration < Date.now()) {
      this.logout();
      return false;
    }

    return true;
  }

  hasRole(role: 'Admin' | 'Customer' | 'EndUser'): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isAdmin(): boolean { return this.hasRole('Admin'); }
  isTenantOwner(): boolean { return this.hasRole('Customer'); }
  isEndUser(): boolean { return this.hasRole('EndUser'); }

  getTenantId(): number | null {
    return this.currentUserSubject.value?.tenantId ?? null;
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  /**
   * Check if user is in preview mode
   * Preview mode: tenantId === 5
   */
  isPreviewMode(): boolean {
    const user = this.getCurrentUser();
    return user ? Number(user.tenantId) === 5 : false;
  }

  /**
   * Get tenant subdomain from localStorage
   */
  getSubdomain(): string | null {
    return localStorage.getItem("tenantSubdomain");
  }

  /**
   * Store login data from register API response
   * Processes JWT token and saves user context
   */
  storeLoginData(response: LoginResponse): void {
    const decoded = this.decodeToken(response.token);

    const userContext: UserContext = {
      role: decoded.role as 'Admin' | 'Customer' | 'EndUser',
      tenantId: Number(decoded.tenantId),
      email: decoded.email,
      fullName: decoded.fullName || decoded.name || decoded.email,
      token: response.token,
      expiration: decoded.exp * 1000
    };

    this.saveUserContext(userContext);
    this.currentUserSubject.next(userContext);
  }

  private loadUserFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const userContext: UserContext = JSON.parse(stored);

        // Ensure tenantId is a number when loading from storage
        if (userContext.tenantId) {
          userContext.tenantId = Number(userContext.tenantId);
        }

        if (userContext.expiration && userContext.expiration < Date.now()) {
          localStorage.removeItem(this.storageKey);
          return;
        }

        this.currentUserSubject.next(userContext);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private saveUserContext(userContext: UserContext): void {
    localStorage.setItem(this.storageKey, JSON.stringify(userContext));
  }

  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid token');
    }
  }
}
