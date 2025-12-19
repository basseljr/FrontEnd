import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private apiUrl = `${environment.apiUrl}/Tenant`;
  private tenantId: number | null = null;
  private isReadySubject = new BehaviorSubject<boolean>(false);
  public isReady$ = this.isReadySubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Resolve tenant from hostname (subdomain or custom domain)
   * Called during APP_INITIALIZER
   */
  resolveTenant(): Observable<boolean> {
    const hostname = window.location.hostname;
    
    // Skip resolution for localhost or main domain (builder)
    // if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('aiw.com') && !hostname.split('.')[0] || hostname.split('.')[0] === 'aiw') {
    //   this.isReadySubject.next(true);
    //   return of(true);
    // }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.tenantId = 1;    // FORCE TENANT FOR LOCAL DEVELOPMENT
      this.isReadySubject.next(true);
      return of(true);
    }
    

    const params = new HttpParams().set('host', hostname);
    
    return this.http.get<{ tenantId: number }>(`${this.apiUrl}/resolve`, { params }).pipe(
      tap(response => {
        this.tenantId = response.tenantId;
        this.isReadySubject.next(true);
      }),
      map(() => true), // Transform to boolean
      catchError(error => {
        console.error('Failed to resolve tenant:', error);
        // Still mark as ready to prevent app from hanging
        this.isReadySubject.next(true);
        return of(false);
      })
    );
  }

  /**
   * Get the resolved tenant ID
   */
  getTenantId(): number | null {
    return this.tenantId;
  }

  /**
   * Check if tenant is ready (resolved)
   */
  isReady(): Observable<boolean> {
    return this.isReady$;
  }
}

