import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { ChartWidgetComponent } from '../../components/chart-widget/chart-widget.component';
import { TopSellingTableComponent } from '../../components/top-selling-table/top-selling-table.component';
import { ChartConfiguration } from 'chart.js';
import { SalesSummary, TopItem, OrderStatusBreakdown, CustomerAnalytics } from '../../../../../core/models/analytics.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartWidgetComponent, TopSellingTableComponent],
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

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
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

