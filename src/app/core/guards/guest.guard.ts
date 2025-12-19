import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (!user) {
      return true;
    }

    // Redirect authenticated users to their appropriate dashboard
    switch (user.role) {
      case 'Admin':
        router.navigate(['/admin/dashboard/overview']);
        break;
      case 'Customer':
        router.navigate(['/dashboard']);
        break;
      case 'EndUser':
        // For end users, redirect to account page if slug available
        const currentUrl = state.url;
        const slugMatch = currentUrl.match(/\/site\/([^\/]+)/);
        if (slugMatch) {
          router.navigate(['/site', slugMatch[1], 'account']);
        } else {
          router.navigate(['/']);
        }
        break;
      default:
        router.navigate(['/']);
    }
    return false;
  }

  return true;
};

