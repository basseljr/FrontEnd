import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../../core/services/order.service';
import { TenantService } from '../../../../../core/services/tenant.service';
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
  private refreshSubscription?: Subscription;

  constructor(
    private orderService: OrderService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
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

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadOrders() {
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

