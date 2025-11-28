import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesSummary, TopItem, OrderStatusBreakdown, CustomerAnalytics } from '../models/analytics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/Analytics`;

  constructor(private http: HttpClient) {}

  getSalesSummary(period: string = 'daily', startDate?: string, endDate?: string): Observable<SalesSummary> {
    let params = new HttpParams().set('period', period);
  
    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }
  
    return this.http.get<SalesSummary>(`${this.apiUrl}/sales`, { params });
  }
  

  
  getTopItems(limit: number = 10): Observable<TopItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopItem[]>(`${this.apiUrl}/top-items`, { params });
  }

  getOrderStatusBreakdown(): Observable<OrderStatusBreakdown[]> {
    return this.http.get<OrderStatusBreakdown[]>(`${this.apiUrl}/status-breakdown`);
  }

  getCustomerAnalytics(): Observable<CustomerAnalytics> {
    return this.http.get<CustomerAnalytics>(`${this.apiUrl}/customers`);
  }
  
}

