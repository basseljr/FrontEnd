import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';
import { MenuService } from '../../../../../core/services/menu.service';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order, OrderStatus } from '../../../../../core/models/order.model';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { OrderDetailModalComponent } from "../../components/order-detail-modal/order-detail-modal.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, OrderCardComponent, OrderDetailModalComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  totalOrders = 0;
  totalRevenue = 0;
  totalCustomers = 0;
  totalMenuItems = 0;
  recentOrders: Order[] = [];
  loading = true;
  selectedOrder: Order | null = null;
  isModalOpen = false;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private analyticsService: AnalyticsService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    // Wait for tenant to be ready before loading data
    this.tenantService.isReady().pipe(
      filter(ready => ready === true),
      take(1)
    ).subscribe(() => {
      this.loadDashboardData();
    });
  }

  loadDashboardData() {
    this.loading = true;
    forkJoin({
      orders: this.orderService.getAllOrders(),
      menuItems: this.menuService.getAllItems(),
      analytics: this.analyticsService.getCustomerAnalytics()
    }).subscribe({
      next: (data) => {
        this.totalOrders = data.orders.length;
        this.totalRevenue = data.orders.reduce((sum, order) => sum + order.total, 0);
        this.totalMenuItems = data.menuItems.length;
        this.totalCustomers = data.analytics.totalCustomers;
        this.recentOrders = data.orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  onUpdateStatus(event: { order: Order; status: string }) {
    const newStatus = event.status as OrderStatus;
  
    this.orderService.updateOrderStatus(event.order.id, newStatus).subscribe({
      next: () => event.order.status = newStatus,
      error: () => alert('Failed to update order status')
    });
  }

  
openModal(order: Order) {
  this.selectedOrder = order;
  this.isModalOpen = true;
}

closeModal() {
  this.selectedOrder = null;
  this.isModalOpen = false;
}
  
}

