import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';
import { AuthenticationService } from '../services/authentication.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const authService = inject(AuthenticationService);

  // For authenticated users, use tenantId from auth context
  // For public routes, use tenantId from TenantService (resolved by APP_INITIALIZER)
  let tenantId: number | null = null;
  
  if (authService.isAuthenticated()) {
    tenantId = authService.getTenantId();
  } else {
    tenantId = tenantService.getTenantId();
  }

  // Add X-Tenant-Id header if tenant is available
  if (tenantId !== null) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-Tenant-Id': tenantId.toString()
      }
    });
    return next(clonedReq);
  }

  // For requests without tenant (e.g., localhost, main domain), proceed without header
  return next(req);
};

