import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/Inventory`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  updateStock(id: number, stockQuantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stock`, { stockQuantity });
  }

  bulkUpdateStock(items: { id: number; stockQuantity: number }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/bulk`, items);
  }
}

