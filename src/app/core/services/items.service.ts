import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = 'http://localhost:5240/Items'; // adjust if needed

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }
}
