import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Standalone root component */
import { AdminDashboardComponent } from './admin-dashboard.component';

/* Standalone child components */
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { InventoryComponent } from './pages/inventory/inventory.component';

/* Routing */
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    // Must import routing AFTER CommonModule
    AdminDashboardRoutingModule,

    // Standalone components → imported, not declared
    AdminDashboardComponent,
    SidebarComponent,
    OverviewComponent,
    OrdersComponent,
    MenuComponent,
    CategoriesComponent,
    CustomersComponent,
    AnalyticsComponent,
    SettingsComponent,
    InventoryComponent
  ],
})
export class AdminDashboardModule {}
