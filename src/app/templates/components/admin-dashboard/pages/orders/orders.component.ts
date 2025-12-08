import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../core/services/order.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { Order, OrderStatus } from '../../../../../core/models/order.model';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { OrderDetailModalComponent } from '../../components/order-detail-modal/order-detail-modal.component';
import { timer, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, OrderDetailModalComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  selectedOrder: Order | null = null;
  isModalOpen = false;
  loading = true;
  error = '';
  isPreviewMode = false;
  private refreshSubscription?: Subscription;

  constructor(
    private orderService: OrderService,
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
      this.loadOrders();
      // Auto-refresh every 30 seconds
      this.refreshSubscription = timer(0, 30000).subscribe(() => {
        this.loadOrders();
      });
    });
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      this.orders = [
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
      this.filteredOrders = this.orders;
      this.loading = false;
    }, 500);
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadOrders() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredOrders = this.orders;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = this.orders;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.customerName.toLowerCase().includes(term) ||
      order.mobile.includes(term) ||
      order.id.toString().includes(term)
    );
  }

  onStatusChange(order: Order, status: string) {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    this.orderService.updateOrderStatus(order.id, status as OrderStatus).subscribe({
      next: () => {
        order.status = status as OrderStatus;
        this.loadOrders();
      },
      error: () => {
        this.error = 'Failed to update order status';
      }
    });
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }
}

