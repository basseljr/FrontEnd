import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const tenantId = tenantService.getTenantId();

  // Skip adding header if tenant not resolved (for public pages)
  // Only add header if tenantId is available
  if (tenantId !== null) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-Tenant-Id': tenantId.toString()
      }
    });
    return next(clonedReq);
  }

  // For public pages without tenant, proceed without header
  return next(req);
};

