import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5240/Orders';

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

  getOrderById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getOrderHistory(mobile: string) {
    return this.http.get(`${this.apiUrl}/history?mobile=${mobile}`);
  }
}
