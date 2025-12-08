import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { CartItem } from './cart.service';
import { Order, OrderStatus } from '../models/order.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

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
    if (this.authService.isPreviewMode()) {
      return of([]);
    }
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }
  

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status });
  }
}



// @Injectable({ providedIn: 'root' })
// export class OrderService {
//   private apiUrl = `${environment.apiUrl}/orders`;

//   constructor(private http: HttpClient) {}

//   createOrder(order: {
//     customerName: string;
//     email?: string;
//     mobile: string;
//     mode: string;
//     total: number;
//     items: CartItem[];
//   }): Observable<any> {

//     return this.http.post(this.apiUrl, {
//       customerName: order.customerName,
//       email: order.email,
//       mobile: order.mobile,
//       mode: order.mode,
//       total: order.total,
//       items: order.items.map(i => ({
//         itemId: i.id,       // IMPORTANT for stock tracking
//         itemName: i.name,
//         quantity: i.quantity,
//         price: i.price
//       }))
//     });
//   }

//   getOrderById(id: number): Observable<Order> {
//     return this.http.get<Order>(`${this.apiUrl}/${id}`);
//   }

//   getOrderHistory(mobile: string): Observable<Order[]> {
//     return this.http.get<Order[]>(`${this.apiUrl}/history/${mobile}`);
//   }

//   getAllOrders(): Observable<Order[]> {
//     return this.http.get<Order[]>(`${this.apiUrl}`);
//   }

//   updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
//     return this.http.put<Order>(
//       `${this.apiUrl}/${id}/status`,
//       { status }
//     );
//   }
// }
