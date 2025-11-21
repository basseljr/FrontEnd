import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}

