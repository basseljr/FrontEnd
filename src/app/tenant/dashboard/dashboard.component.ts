  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router, RouterModule } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { AuthenticationService } from '../../core/services/authentication.service';
  import { environment } from '../../../environments/environment';

  @Component({
    selector: 'app-tenant-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class TenantDashboardComponent implements OnInit {
    user: any = null;
    tenantSubdomain = '';

    constructor(
      private authService: AuthenticationService,
      private http: HttpClient,
      private router: Router,
      

    ) {}

    ngOnInit() {
      this.user = this.authService.getCurrentUser();
      this.loadTenantSubdomain();
    }

    logout() {
      this.authService.logout();
    }

    loadTenantSubdomain() {
      const tenantId = this.authService.getTenantId();
      if (tenantId) {
        // Fetch tenant info to get subdomain
        this.http.get<any>(`${environment.apiUrl}/Tenants/${tenantId}`).subscribe({
          next: (tenant) => {
            this.tenantSubdomain = tenant.subdomain || tenant.slug || '';
          },
          error: (err) => {
            console.error('Failed to load tenant subdomain', err);
          }
        });
      }
    }

    goToWebsite() {
      if (this.tenantSubdomain) {
        this.router.navigate(['/site', this.tenantSubdomain]);
      }
    }
    
  }

