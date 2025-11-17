import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  templateId: number;
  name: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private apiUrl = 'http://localhost:5240/Categories'; // adjust if needed

  constructor(private http: HttpClient) {}

  getByTemplate(templateId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/template/${templateId}`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }
}
