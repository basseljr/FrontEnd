import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { TenantService } from './core/services/tenant.service';
import { tenantInterceptor } from './core/interceptors/tenant.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export function initializeTenant(tenantService: TenantService) {
  return () => {
    return new Promise<void>((resolve) => {
      tenantService.resolveTenant().subscribe({
        next: () => resolve(),
        error: () => resolve() // Resolve even on error to prevent app from hanging
      });
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tenantInterceptor, authInterceptor])
    ),
    provideCharts(withDefaultRegisterables()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTenant,
      deps: [TenantService],
      multi: true
    }
  ]
};
