import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { Order } from '../../../../../core/models/order.model';
import { CustomerAnalytics } from '../../../../../core/models/analytics.model';

interface Customer {
  name: string;
  mobile: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  analytics: CustomerAnalytics | null = null;
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    this.analyticsService.getCustomerAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        const customerMap = new Map<string, Customer>();
        
        orders.forEach(order => {
          const key = order.mobile;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              name: order.customerName,
              mobile: order.mobile,
              email: order.email,
              totalOrders: 0,
              totalSpent: 0
            });
          }
          
          const customer = customerMap.get(key)!;
          customer.totalOrders++;
          customer.totalSpent += order.total;
          if (!customer.lastOrderDate || order.createdAt > customer.lastOrderDate) {
            customer.lastOrderDate = order.createdAt;
          }
        });
        
        this.customers = Array.from(customerMap.values())
          .sort((a, b) => b.totalSpent - a.totalSpent);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load customers';
        this.loading = false;
      }
    });
  }
}

