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
  private apiUrl = 'http://localhost:5240/Templates'; 

  constructor(private http: HttpClient) {}

  // Get all templates
  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  // Get single template
  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  getTemplateBySlug(slug: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/slug/${slug}`);
}


// saveCustomization(templateId: number, customizationData: any) {
//   const payload = {
//     templateId,
//     customizationData: JSON.stringify(customizationData)
//   };
//   return this.http.post(`${this.apiUrl}/customize`, payload);
// }

saveCustomization(slug: string, customizationData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/customize`, {
    slug,
    customizationData: JSON.stringify(customizationData)
  });
}

}
