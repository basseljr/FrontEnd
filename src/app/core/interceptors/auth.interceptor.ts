import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthenticationService);
//   const token = authService.getToken();

//   // Do NOT add Authorization header to login/register endpoints
//   if (req.url.includes('/Auth/login') || req.url.includes('/Auth/register')) {
//     return next(req);
//   }

//   // Add Authorization header if user is authenticated
//   if (token && authService.isAuthenticated()) {
//     const clonedReq = req.clone({
//       setHeaders: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return next(clonedReq);
//   }

//   // For public routes without authentication, proceed without auth header
//   return next(req);
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const token = authService.getToken();

  // Ignore login/register routes (lowercase)
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // Always attach token if it exists
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};


