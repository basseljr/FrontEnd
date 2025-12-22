import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../../core/services/authentication.service';

@Component({
  selector: 'app-customize',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="text-center py-5">Redirecting to customize your website...</div>`
})
export class CustomizeComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    // Get tenant slug from subdomain
    const slug = this.authService.getSubdomain() || localStorage.getItem('tenantSubdomain');
    
    if (slug) {
      // Redirect to live site with editMode=true
      this.router.navigate(['/site', slug], { 
        queryParams: { editMode: 'true' } 
      });
    } else {
      // Fallback: redirect to overview if no slug found
      console.error('No tenant slug found, redirecting to overview');
      this.router.navigate(['/admin/dashboard/overview']);
    }
  }
}

