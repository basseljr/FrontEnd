import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Add Authorization header if user is logged in (for admin API calls)
  // Public pages won't have a token, so they proceed without header
  if (token && authService.isAuthenticated()) {
    const clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // For public routes without authentication, proceed without auth header
  return next(req);
};

