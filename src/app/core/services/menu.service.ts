import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = `${environment.apiUrl}/Menu`;


  constructor(private http: HttpClient) {}

  getAllItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }

  getItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/item/${id}`);
  }

  addItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/item`, item);
  }

  updateItem(id: number, item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/item/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${id}`);
  }

  toggleAvailability(id: number, isAvailable: boolean): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/item/${id}/availability`, { isAvailable });
  }
}

