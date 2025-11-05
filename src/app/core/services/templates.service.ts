import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Template {
  id: number;
  name: string;
  description: string;
  previewImage: string;
  demoUrl: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private apiUrl = 'http://localhost:5240/Templates'; // adjust port if needed

  constructor(private http: HttpClient) {}

  // Get all templates
  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  // Get single template
  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }
}
