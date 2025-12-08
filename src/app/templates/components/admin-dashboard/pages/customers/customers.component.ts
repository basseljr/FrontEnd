import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../core/services/order.service';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { Order } from '../../../../../core/models/order.model';
import { CustomerAnalytics } from '../../../../../core/models/analytics.model';
import { filter, take } from 'rxjs/operators';

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
  isPreviewMode = false;

  constructor(
    private orderService: OrderService,
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
      this.loadData();
    });
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      this.analytics = {
        totalCustomers: 45,
        newCustomers: 12,
        returningCustomers: 33
      };
      this.customers = [
        { name: 'John Doe', mobile: '+965 12345678', email: 'john@example.com', totalOrders: 5, totalSpent: 125.50, lastOrderDate: new Date().toISOString() },
        { name: 'Jane Smith', mobile: '+965 87654321', email: 'jane@example.com', totalOrders: 3, totalSpent: 85.00, lastOrderDate: new Date(Date.now() - 86400000).toISOString() },
        { name: 'Ahmed Ali', mobile: '+965 11223344', email: 'ahmed@example.com', totalOrders: 8, totalSpent: 210.75, lastOrderDate: new Date(Date.now() - 3600000).toISOString() }
      ];
      this.loading = false;
    }, 500);
  }

  loadData() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
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

