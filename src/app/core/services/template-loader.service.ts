import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomizationService } from './customization.service';

@Injectable({ providedIn: 'root' })
export class TemplateLoaderService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private customization: CustomizationService
  ) {}

  /** Load either demo or tenant customization */
  loadTemplateData(): void {
    const domain = window.location.hostname;
    const isDemo = window.location.pathname.includes('/demo/');

    if (isDemo) {
      const slug = window.location.pathname.split('/demo/')[1];
      this.loadDemo(slug);
    } else {
      this.loadTenant(domain);
    }
  }

  private loadDemo(slug: string): void {
    this.http.get(`${this.apiUrl}/Templates/slug/${slug}`).subscribe({
      next: (res: any) => this.customization.loadData(res.customizationData),
      error: err => console.error('Failed to load demo template', err)
    });
  }

  private loadTenant(domain: string): void {
    this.http
      .get<any>(`${this.apiUrl}/Tenants/by-domain?domain=${domain}`)
      .pipe(
        switchMap(tenant =>
          this.http
            .get(`${this.apiUrl}/TenantCustomizations/${tenant.tenantId}`)
            .pipe(map((res: any) => ({ tenant, res })))
        )
      )
      .subscribe({
        next: ({ res }) => this.customization.loadData(res.customizationData),
        error: err => console.error('Failed to load tenant customization', err)
      });
  }

  /** Save the current customization for a tenant */
  saveCustomization(tenantId: number): Observable<any> {
    const payload = {
      tenantId,
      customizationData: JSON.stringify(this.customization.getCurrentData())
    };
    return this.http.post(`${this.apiUrl}/TenantCustomizations`, payload);
  }
}
