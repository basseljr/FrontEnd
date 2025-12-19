import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TemplateContextService } from '../../../core/services/template-context.service';
import { TemplateDraftService } from '../../../core/services/template-draft.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditableDirective, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  customData: any = {};
  cartCount = 0;
  isAuthenticated = false;
  user: any = null;
  currentSlug = '';

  constructor(
    private customization: CustomizationService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private templateContext: TemplateContextService,
    private draftService: TemplateDraftService
  ) {}

  ngOnInit() {
    // Watch header customization
    this.customization.currentData.subscribe(data => {
      this.customData = data.header;
    });

    // Watch cart changes
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    });

    // Watch auth state
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isAuthenticated = this.authService.isAuthenticated();
    });

    // Get current slug from route if available
    this.route.params.subscribe(params => {
      this.currentSlug = params['slug'] || '';
    });

    // Initial check
    this.user = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  goToCart() {
    if (this.currentSlug) {
      this.router.navigate(['/site', this.currentSlug, 'cart']);
    } else {
      this.router.navigate(['/demo/restaurant-menu/cart']);
    }
  }

  goToLogin() {
    if (this.isPublishedSite()) {
      // End-user login on published website
      this.router.navigate(['/site', this.currentSlug, 'login']);
    } else {
      // Template preview + demo → tenant login
      this.router.navigate(['/login']);
    }
  }

  goToAccount() {
    if (this.user?.role === 'Admin') {
      this.router.navigate(['/admin/dashboard/overview']);
    } else if (this.user?.role === 'Customer') {
      this.router.navigate(['/admin/dashboard/overview']);
    } else if (this.user?.role === 'EndUser' && this.currentSlug) {
      this.router.navigate(['/site', this.currentSlug, 'account']);
    }
  }

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isTenantOwner(): boolean {
    return this.authService.isTenantOwner();
  }

  isEndUser(): boolean {
    return this.authService.isEndUser();
  }

  isDemo(): boolean {
    return this.templateContext.isDemo();
  }

  isPreview(): boolean {
    return this.templateContext.isTemplatePreview();
  }

  isPublishedSite(): boolean {
    return this.templateContext.isPublishedSite();
  }

  isTenantLoggedIn(): boolean {
    return this.authService.isAuthenticated() && this.authService.isTenantOwner();
  }

  isEndUserLoggedIn(): boolean {
    return this.authService.isAuthenticated() && this.authService.isEndUser();
  }

  isPreviewUser(): boolean {
    const u = this.authService.getCurrentUser();
    return !!(u && Number(u.tenantId) === 5);
  }

  isTenant(): boolean {
    const u = this.authService.getCurrentUser();
    return !!(u && Number(u.tenantId) > 5);
  }

  isRealTenant(): boolean {
    const u = this.authService.getCurrentUser();
    return !!(u && Number(u.tenantId) > 5);
  }

  isLiveSite(): boolean {
    return window.location.pathname.startsWith('/site/');
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  goToAdmin() {
    // Don't show in header for live sites or real tenants (moved to sidebar)
    if (this.isLiveSite() || this.isRealTenant()) {
      return;
    }
    const u = this.authService.getCurrentUser();
    if (u && Number(u.tenantId) === 5) {
      this.router.navigate(['/admin/dashboard/overview'], { queryParams: { preview: true } });
    } else {
      this.router.navigate(['/admin/dashboard/overview']);
    }
  }

  goToWebsite() {
    // Don't show in header for live sites or real tenants (moved to sidebar)
    if (this.isLiveSite() || this.isRealTenant()) {
      return;
    }
    const u = this.authService.getCurrentUser();
    if (u && Number(u.tenantId) > 5) {
      // Real tenant - navigate to their site
      const subdomain = localStorage.getItem('currentSubdomain') || 
                       (window.location.hostname !== 'localhost' && window.location.hostname.split('.')[0]) ||
                       this.currentSlug;
      if (subdomain && subdomain !== 'localhost' && subdomain !== 'aiw') {
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost')) {
          this.router.navigate(['/site', subdomain]);
        } else {
          window.location.href = `https://${subdomain}.aiw.com`;
        }
      } else {
        // Fallback: try to get from route or draft
        this.router.navigate(['/site', this.currentSlug]);
      }
    } else {
      // Preview user - navigate back to template-selected
      const templateId = this.draftService.getTemplateId();
      const templateSlug = this.currentSlug || this.route.snapshot.queryParams['slug'] || 'restaurant-menu';
      
      if (templateId) {
        this.router.navigate(['/template-selected'], { queryParams: { id: templateId, slug: templateSlug } });
      } else {
        this.router.navigate(['/template-selected'], { queryParams: { slug: templateSlug } });
      }
    }
  }
}
