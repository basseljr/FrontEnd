import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = `${environment.apiUrl}/Menu`;


  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getAllItems(): Observable<MenuItem[]> {
    if (this.authService.isPreviewMode()) {
      return of([]);
    }
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }
  

  getItem(id: number): Observable<MenuItem> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.get<MenuItem>(`${this.apiUrl}/item/${id}`);
  }

  addItem(item: MenuItem): Observable<MenuItem> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.post<MenuItem>(`${this.apiUrl}/item`, item);
  }

  updateItem(id: number, item: MenuItem): Observable<MenuItem> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put<MenuItem>(`${this.apiUrl}/item/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.delete<void>(`${this.apiUrl}/item/${id}`);
  }

  // toggleAvailability(id: number, isAvailable: boolean): Observable<MenuItem> {
  //   return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}/availability`, { isAvailable });
  // }

  toggleAvailability(id: number, enabled: boolean): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}/availability?enabled=${enabled}`, {});
  }
  
}

