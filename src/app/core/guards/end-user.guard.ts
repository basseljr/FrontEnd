import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TenantService } from '../services/tenant.service';

export const endUserGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const tenantService = inject(TenantService);

  if (!authService.isAuthenticated()) {
    const slug = route.params['slug'];
    if (slug) {
      router.navigate(['/site', slug, 'login'], { queryParams: { returnUrl: state.url } });
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  const user = authService.getCurrentUser();
  if (!user || user.role !== 'EndUser') {
    const slug = route.params['slug'];
    if (slug) {
      router.navigate(['/site', slug, 'login'], { queryParams: { returnUrl: state.url } });
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  // Verify tenantId matches current site's tenant
  // For /site/:slug routes, use slug-based tenantId lookup
  const slug = route.params['slug'];
  let currentTenantId: number | null = null;
  
  if (slug) {
    // Use slug-based tenantId from localStorage (set by TemplateLoaderService)
    const slugTenantId = localStorage.getItem(`tenantId_for_${slug}`);
    currentTenantId = slugTenantId ? Number(slugTenantId) : null;
  } else {
    // Fallback to hostname-based resolution for non-slug routes
    currentTenantId = tenantService.getTenantId();
  }
  
  if (currentTenantId && user.tenantId !== currentTenantId) {
    if (slug) {
      router.navigate(['/site', slug, 'login'], { queryParams: { returnUrl: state.url } });
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};

