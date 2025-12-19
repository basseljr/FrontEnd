import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';
import { AuthenticationService } from '../services/authentication.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const authService = inject(AuthenticationService);

  let tenantId: number | null = null;
  
  // For authenticated users, use tenantId from auth context
  if (authService.isAuthenticated()) {
    tenantId = authService.getTenantId();
  } else {
    // For public routes, check if we're on a /site/:slug route
    const currentPath = window.location.pathname;
    const siteMatch = currentPath.match(/^\/site\/([^\/]+)/);
    
    if (siteMatch) {
      // Extract slug from current route
      const slug = siteMatch[1];
      // Use slug-based tenantId from localStorage (set by TemplateLoaderService)
      const slugTenantId = localStorage.getItem(`tenantId_for_${slug}`);
      tenantId = slugTenantId ? Number(slugTenantId) : null;
    } else {
      // For non-slug routes, use hostname-based resolution
      tenantId = tenantService.getTenantId();
    }
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

