import { Routes } from '@angular/router';
import { LandingPageComponent } from './modules/landing/landing-page/landing-page.component';
import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { TemplatePreviewComponent } from './templates/template-preview/template-preview.component';
import { TemplateSelectedComponent } from './templates/template-selected/template-selected.component';

// Tenant owner auth
import { TenantLoginComponent } from './tenant/auth/login/login.component';
import { TenantRegisterComponent } from './tenant/auth/register/register.component';

// Tenant owner dashboard (YOUR admin dashboard)
import { tenantOwnerGuard } from './core/guards/tenant-owner.guard';

// Super admin login (NOT used for tenants)
import { LoginAdminComponent } from './admin/auth/login-admin/login-admin.component';

// End user (customer) auth
import { EndUserLoginComponent } from './site/restaurant-template/pages/login/login.component';
import { EndUserRegisterComponent } from './site/restaurant-template/pages/register/register.component';
import { EndUserAccountComponent } from './site/restaurant-template/pages/account/account.component';
import { endUserGuard } from './core/guards/end-user.guard';

import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'templates', pathMatch: 'full' },

  // Public browsing
  { path: 'landing', component: LandingPageComponent },
  { path: 'templates', component: TemplatesListComponent },
  { path: 'template-preview', component: TemplatePreviewComponent },
  { path: 'template-selected', component: TemplateSelectedComponent },

  // -------------------------------
  // TENANT OWNER AUTH + DASHBOARD
  // -------------------------------
  { path: 'login', component: TenantLoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: TenantRegisterComponent, canActivate: [guestGuard] },

  {
    path: 'admin/dashboard',
    canActivate: [tenantOwnerGuard],
    loadChildren: () =>
      import('./templates/components/admin-dashboard/admin-dashboard.module')
        .then(m => m.AdminDashboardModule)
  },

  // -------------------------------
  // SUPER ADMIN (NOT TENANT)
  // -------------------------------
  { path: 'admin/login', component: LoginAdminComponent, canActivate: [guestGuard] },

  // -------------------------------
  // END USER (CUSTOMER WEBSITE)
  // -------------------------------
  { path: 'site/:slug/login', component: EndUserLoginComponent, canActivate: [guestGuard] },
  { path: 'site/:slug/register', component: EndUserRegisterComponent, canActivate: [guestGuard] },
  { path: 'site/:slug/account', component: EndUserAccountComponent, canActivate: [endUserGuard] },

  // WEBSITE ROUTES
  {
    path: 'site/:slug',
    loadChildren: () =>
      import('./templates/demo-templates/restaurant-template/restaurant-template-routing.module')
        .then(m => m.RestaurantTemplateRoutingModule)
  },

  // DEMO ROUTES
  {
    path: 'demo/:slug',
    loadChildren: () =>
      import('./templates/demo-templates/restaurant-template/restaurant-template-routing.module')
        .then(m => m.RestaurantTemplateRoutingModule)
  },
];
