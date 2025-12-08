import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { ChartWidgetComponent } from '../../components/chart-widget/chart-widget.component';
import { TopSellingTableComponent } from '../../components/top-selling-table/top-selling-table.component';
import { ChartConfiguration } from 'chart.js';
import { SalesSummary, TopItem, OrderStatusBreakdown, CustomerAnalytics } from '../../../../../core/models/analytics.model';
import { forkJoin } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent, TopSellingTableComponent, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  salesChartData: ChartConfiguration['data'] | null = null;
  topItemsChartData: ChartConfiguration['data'] | null = null;
  statusChartData: ChartConfiguration['data'] | null = null;
  customerChartData: ChartConfiguration['data'] | null = null;
  topItems: TopItem[] = [];
  loading = true;
  error = '';
  selectedFilter = 'today';
  startDate: string | null = null;
  endDate: string | null = null;
  isPreviewMode = false;


  constructor(
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
      this.loadAnalytics();
    });
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      const dummySales: SalesSummary = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [120, 150, 180, 200, 175, 220, 190],
        period: 'daily'
      };
      const dummyTopItems: TopItem[] = [
        { itemId: 1, itemName: 'Classic Burger', quantitySold: 45, revenue: 247.5 },
        { itemId: 2, itemName: 'Margherita Pizza', quantitySold: 32, revenue: 272.0 },
        { itemId: 3, itemName: 'Cola', quantitySold: 60, revenue: 90.0 }
      ];
      const dummyStatusBreakdown: OrderStatusBreakdown[] = [
        { status: 'Pending', count: 5, percentage: 0 },
        { status: 'Preparing', count: 3, percentage: 0 },
        { status: 'Ready', count: 2, percentage: 0 },
        { status: 'Completed', count: 12, percentage: 0 }
      ];
      const dummyCustomerAnalytics: CustomerAnalytics = {
        totalCustomers: 45,
        newCustomers: 12,
        returningCustomers: 33
      };

      this.setupSalesChart(dummySales);
      this.setupTopItemsChart(dummyTopItems);
      this.setupStatusChart(dummyStatusBreakdown);
      this.setupCustomerChart(dummyCustomerAnalytics);
      this.topItems = dummyTopItems;
      this.loading = false;
    }, 500);
  }

  loadAnalytics() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
    
    forkJoin({
      sales: this.analyticsService.getSalesSummary('daily'),
      topItems: this.analyticsService.getTopItems(5),
      statusBreakdown: this.analyticsService.getOrderStatusBreakdown(),
      customers: this.analyticsService.getCustomerAnalytics()
    }).subscribe({
      next: (data) => {
        this.setupSalesChart(data.sales);
        this.setupTopItemsChart(data.topItems);
        this.setupStatusChart(data.statusBreakdown);
        this.setupCustomerChart(data.customers);
        this.topItems = data.topItems;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load analytics';
        this.loading = false;
      }
    });
  }

  onPeriodChange() {
    switch (this.selectedFilter) {
      case 'today':
        this.loadByRange(new Date(), new Date());
        break;
  
      case 'yesterday':
        const y = new Date();
        y.setDate(y.getDate() - 1);
        this.loadByRange(y, y);
        break;
  
      case 'last7':
        const s7 = new Date();
        s7.setDate(s7.getDate() - 6);
        this.loadByRange(s7, new Date());
        break;
  
      case 'last30':
        const s30 = new Date();
        s30.setDate(s30.getDate() - 29);
        this.loadByRange(s30, new Date());
        break;
  
      case 'thisMonth':
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        this.loadByRange(start, new Date());
        break;
  
      case 'custom':
        // User will pick dates manually
        break;
    }
  }
  
  applyCustom() {
    if (!this.startDate || !this.endDate) return;
  
    this.loadByRange(new Date(this.startDate), new Date(this.endDate));
  }
  
  loadByRange(start: Date, end: Date) {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
  
    this.analyticsService.getSalesSummary('range', start.toISOString(), end.toISOString())
      .subscribe({
        next: (data) => {
          this.setupSalesChart(data);
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load filtered analytics';
          this.loading = false;
        }
      });
  }
  



  setupSalesChart(data: SalesSummary) {
    this.salesChartData = {
      labels: data.labels,
      datasets: [{
        label: 'Sales (KWD)',
        data: data.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };
  }

  setupTopItemsChart(items: TopItem[]) {
    this.topItemsChartData = {
      labels: items.map(item => item.itemName),
      datasets: [{
        label: 'Revenue (KWD)',
        data: items.map(item => item.revenue),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    };
  }

  setupStatusChart(breakdown: OrderStatusBreakdown[]) {
    this.statusChartData = {
      labels: breakdown.map(b => b.status),
      datasets: [{
        data: breakdown.map(b => b.count),
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }]
    };
  }

  setupCustomerChart(analytics: CustomerAnalytics) {
    this.customerChartData = {
      labels: ['New Customers', 'Returning Customers'],
      datasets: [{
        data: [analytics.newCustomers, analytics.returningCustomers],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ]
      }]
    };
  }

  exportToCSV() {
    const csvData: string[] = [];
    
    // Sales data
    if (this.salesChartData) {
      csvData.push('Sales Data');
      csvData.push('Date,Amount (KWD)');
      this.salesChartData.labels?.forEach((label, index) => {
        csvData.push(`${label},${this.salesChartData?.datasets[0].data[index]}`);
      });
      csvData.push('');
    }

    

    // Top items
    csvData.push('Top Selling Items');
    csvData.push('Item Name,Quantity Sold,Revenue (KWD)');
    this.topItems.forEach(item => {
      csvData.push(`${item.itemName},${item.quantitySold},${item.revenue}`);
    });

    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

