import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../core/services/order.service';
import { MenuService } from '../../../../../core/services/menu.service';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
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
  isPreviewMode = false;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private analyticsService: AnalyticsService,
    private tenantService: TenantService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check preview mode FIRST - before any API calls
    this.isPreviewMode = this.authService.isPreviewMode() || (this.route.snapshot.queryParamMap.get('preview') === 'true');

    if (this.isPreviewMode) {
      this.loadDummyData();
      return; // Exit early - no API calls
    }

    // Wait for tenant to be ready before loading data
    this.tenantService.isReady().pipe(
      filter(ready => ready === true),
      take(1)
    ).subscribe(() => {
      this.loadDashboardData();
    });
  }

  loadDummyData() {
    this.loading = true;
    // Simulate loading delay 
    setTimeout(() => {
      this.totalOrders = 12;
      this.totalRevenue = 2450.50;
      this.totalCustomers = 45;
      this.totalMenuItems = 28;
      this.recentOrders = [
        {
          id: 1,
          customerName: 'John Doe',
          mobile: '+965 12345678',
          email: 'john@example.com',
          mode: 'Delivery',
          items: [{ itemName: 'Burger', quantity: 2, price: 5.5 }],
          total: 11.0,
          status: 'Pending' as OrderStatus,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          mobile: '+965 87654321',
          email: 'jane@example.com',
          mode: 'Delivery',
          items: [{ itemName: 'Pizza', quantity: 1, price: 8.5 }],
          total: 8.5,
          status: 'Preparing' as OrderStatus,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      this.loading = false;
    }, 500);
  }

  loadDashboardData() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
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
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
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

