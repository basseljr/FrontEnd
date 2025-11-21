import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { Order, OrderStatus } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: {
    customerName: string;
    email?: string;
    mobile: string;
    mode: string;
    total: number;
    items: CartItem[];  
  }): Observable<any> {
    const payload = {
      customerName: order.customerName,
      email: order.email,
      mobile: order.mobile,
      mode: order.mode,
      total: order.total,
      items: order.items.map(i => ({
        itemName: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    };
    return this.http.post(this.apiUrl, payload);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrderHistory(mobile: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/history?mobile=${mobile}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status });
  }
}
