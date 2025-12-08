import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateFlowService {

  private apiUrl = `${environment.apiUrl}/TemplateFlow`;

  constructor(private http: HttpClient) {}

  saveDraft(templateId: number, customization: any): Observable<any> {
    const body = {
      templateId: templateId,
      customizationData: JSON.stringify(customization)
    };
  
    return this.http.post(`${this.apiUrl}/save-draft`, body);
  }
  

  getDraft(draftId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/draft/${draftId}`);
  }

  createTenantFromDraft(draftId: string, email: string, password: string, plan: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-tenant-from-draft`, {
      draftId,
      email,
      password,
      plan
    }).pipe(
      tap((response: any) => {
        // Store subdomain when tenant is created
        if (response?.subdomain) {
          localStorage.setItem("tenantSubdomain", response.subdomain);
        }
      })
    );
  }
}
