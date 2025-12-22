import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Item {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  stockQuantity?: number;
  isTrackStock?: boolean;
  discount?: number;
  finalPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = `${environment.apiUrl}/Items`;

  constructor(private http: HttpClient) {}

  // Correct multi-tenant endpoint
  getByCategory(categoryId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }
}
