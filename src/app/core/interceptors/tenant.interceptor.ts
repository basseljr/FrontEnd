import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const tenantId = tenantService.getTenantId();

  // Add X-Tenant-Id header to all requests if tenant is resolved
  // This includes /Auth/login endpoint (tenant should be resolved by APP_INITIALIZER)
  // If tenantId is null (e.g., on localhost), proceed without header
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

