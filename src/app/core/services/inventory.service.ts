import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { InventoryItem } from '../models/inventory.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/Inventory`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getInventory(): Observable<InventoryItem[]> {
    if (this.authService.isPreviewMode()) {
      return of([]);
    }
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  updateStock(id: number, stockQuantity: number): Observable<any> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put(`${this.apiUrl}/${id}/stock`, { stockQuantity });
  }

  bulkUpdateStock(items: { id: number; stockQuantity: number }[]): Observable<any> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put(`${this.apiUrl}/bulk`, items);
  }
}

