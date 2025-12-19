

// @Injectable({ providedIn: 'root' })
// export class CategoriesService {
//   private apiUrl = `${environment.apiUrl}/Categories`;

//   constructor(private http: HttpClient) {}

//   getAllCategories(): Observable<Category[]> {
//     return this.http.get<Category[]>(this.apiUrl);
//   }

//   getByTemplate(templateId: number): Observable<Category[]> {
//     return this.http.get<Category[]>(`${this.apiUrl}/template/${templateId}`);
//   }

//   getCategory(id: number): Observable<Category> {
//     return this.http.get<Category>(`${this.apiUrl}/${id}`);
//   }

//   createCategory(category: Category): Observable<Category> {
//     return this.http.post<Category>(this.apiUrl, category);
//   }

//   updateCategory(id: number, category: Category): Observable<Category> {
//     return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
//   }

//   deleteCategory(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }

//   updateCategoryOrder(categories: Category[]): Observable<Category[]> {
//     // Send only id and displayOrder
//     const orderData = categories.map(cat => ({
//       id: cat.id,
//       displayOrder: cat.displayOrder || 0
//     }));
//     return this.http.put<Category[]>(`${this.apiUrl}/order`, orderData);
//   }

//   toggleAvailability(id: number, enabled: boolean): Observable<Category> {
//     return this.http.put<Category>(`${this.apiUrl}/${id}/availability?enabled=${enabled}`, {});
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/Categories`;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getAllCategories(): Observable<Category[]> {
    if (this.authService.isPreviewMode()) {
      return of([]);
    }
    // TENANT WILL BE ADDED BY TenantInterceptor
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<Category> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    if (this.authService.isPreviewMode()) {
      return EMPTY;
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCategoryOrder(categories: Category[]): Observable<any> {
    const orderData = categories.map(c => ({
      id: c.id,
      displayOrder: c.displayOrder ?? 0
    }));
    return this.http.put(`${this.apiUrl}/order`, orderData);
  }

  toggleAvailability(id: number, enabled: boolean): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}/availability?enabled=${enabled}`, {});
  }
}
