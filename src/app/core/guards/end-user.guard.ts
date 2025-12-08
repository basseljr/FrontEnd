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
  const currentTenantId = tenantService.getTenantId();
  if (currentTenantId && user.tenantId !== currentTenantId) {
    const slug = route.params['slug'];
    if (slug) {
      router.navigate(['/site', slug, 'login'], { queryParams: { returnUrl: state.url } });
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};

