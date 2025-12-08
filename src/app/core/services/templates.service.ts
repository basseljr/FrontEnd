// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface Template {
//   id: number;
//   name: string;
//   description: string;
//   previewImage: string;
//   demoUrl: string;
//   category: string;
//   slug?: string;
//   defaultCustomization?: any;
//   customizationData?: any;
// }

// @Injectable({ providedIn: 'root' })
// export class TemplatesService {
//   private apiUrl = 'http://localhost:5240/Templates'; 

//   constructor(private http: HttpClient) {}

//   // Get all templates
//   getTemplates(): Observable<Template[]> {
//     return this.http.get<Template[]>(this.apiUrl);
//   }

//   // Get single template
//   getTemplate(id: number): Observable<Template> {
//     return this.http.get<Template>(`${this.apiUrl}/${id}`);
//   }

//   getTemplateBySlug(slug: string): Observable<any> {
//   return this.http.get<any>(`${this.apiUrl}/slug/${slug}`);
// }


// // saveCustomization(templateId: number, customizationData: any) {
// //   const payload = {
// //     templateId,
// //     customizationData: JSON.stringify(customizationData)
// //   };
// //   return this.http.post(`${this.apiUrl}/customize`, payload);
// // }

// saveCustomization(slug: string, customizationData: any): Observable<any> {
//   return this.http.post(`${this.apiUrl}/customize`, {
//     slug,
//     customizationData: JSON.stringify(customizationData)
//   });
// }

// // getTemplateByDomain(): Observable<any> {
// //   return this.http.get(`${this.apiUrl}/domain`);
// // }

// getTemplateByDomain(domain: string): Observable<any> {
//   return this.http.get(`${this.apiUrl}/domain?domain=${domain}`);
// }

// publishTemplate(templateId: number, customizationData: any, userData: any): Observable<any> {
//   const payload = {
//     templateId,
//     customizationData: JSON.stringify(customizationData),
//     userData: {
//       name: userData.name,
//       email: userData.email,
//       mobile: userData.mobile,
//       country: userData.country,
//       password: userData.password
//     }
//   };
//   return this.http.post(`${this.apiUrl}/publish`, payload);
// }

// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Template {
  id: number;
  name: string;
  description: string;
  previewImage: string;     // URL (not Base64)
  demoUrl: string;
  category: string;
  slug?: string;
  defaultCustomization?: any;
  customizationData?: any;
}

@Injectable({ providedIn: 'root' })
export class TemplatesService {

  private apiUrl = `${environment.apiUrl}/Templates`;

  constructor(private http: HttpClient) {}

  /** Get all templates */
  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  /** Get template by ID */
  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  /** Get by slug */
  getTemplateBySlug(slug: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/slug/${slug}`);
  }

  /** Save a customization draft */
  saveCustomization(slug: string, customizationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customize`, {
      slug,
      customizationData: JSON.stringify(customizationData)
    });
  }

  /** Get template for domain */
  getTemplateByDomain(domain: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/domain?domain=${domain}`);
  }
}
