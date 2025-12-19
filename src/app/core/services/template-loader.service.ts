import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomizationService } from './customization.service';
import { TenantService } from './tenant.service';

@Injectable({ providedIn: 'root' })
export class TemplateLoaderService {
  private apiUrl = environment.apiUrl;
  private loaded = false; 
  private loadedSlug: string | null = null;

  constructor(
    private http: HttpClient,
    private customization: CustomizationService,
    private tenantService: TenantService
  ) {}

  /** Load either demo or tenant customization */


  loadTemplateData(): void {
    const path = window.location.pathname;
  
    const isLive = path.startsWith('/site/');
    const isDemo = path.startsWith('/demo/');
  
    let slug: string | null = null;
  
    if (isLive) {
      slug = path.split('/site/')[1]?.split('/')[0];
    } else if (isDemo) {
      slug = path.split('/demo/')[1]?.split('/')[0];
    }
  
    // ❗ If no slug → stop
    if (!slug) return;
  
    // ❗ Fix: prevent DOUBLE API CALL
    if (this.loadedSlug === slug) {
      // console.log("Slug already loaded, skipping second call");
      return;
    }
  
    // Mark as loaded
    this.loadedSlug = slug;
  
    // Continue with your existing call
    this.loadTenant(slug);
  }
  
  

  private loadDemo(slug: string): void {
    this.http.get(`${this.apiUrl}/Templates/slug/${slug}`).subscribe({
      next: (res: any) => this.customization.loadData(res.customizationData),
      error: err => console.error('Failed to load demo template', err)
    });
  }

  private loadTenant(slug: string): void {
    this.http
      .get<any>(`${this.apiUrl}/Tenant/by-subdomain/${slug}`)
      .subscribe({
        next: (tenant: any) => {
          
          // Save tenantId for future end-user login
          localStorage.setItem(`tenantId_for_${slug}`, String(tenant.tenantId));
  
          // Load customization into UI
          this.customization.loadData(tenant.customizationData);
        },
        error: err => console.error('Failed to load tenant customization', err)
      });
  }
  

  /** Save the current customization for a tenant */
  saveCustomization(): Observable<any> {
    const tenantId = this.tenantService.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant ID not available');
    }
    const payload = {
      tenantId,
      customizationData: JSON.stringify(this.customization.getCurrentData())
    };
    return this.http.post(`${this.apiUrl}/TenantCustomizations`, payload);
  }
}
