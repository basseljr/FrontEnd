import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const tenantOwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // 1. Must be logged in
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = authService.getCurrentUser();
  const tenantId = Number(user?.tenantId);

  // 2. Must be a customer (tenant owner)
  if (!user || user.role !== 'Customer') {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 3. Allow:
  // - Preview users (tenantId = 5)
  // - Real tenants (tenantId > 5)
  if (tenantId === 5 || tenantId > 5) {
    return true;
  }

  // 4. Anything else → block
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
