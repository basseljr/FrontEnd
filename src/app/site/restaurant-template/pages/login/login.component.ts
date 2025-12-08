import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { TenantService } from '../../../../core/services/tenant.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-end-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class EndUserLoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  error = '';
  slug = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    // Check if end user already logged in
    if (this.authService.isAuthenticated() && this.authService.isEndUser()) {
      this.router.navigate(['/site', this.slug, 'account']);
      return;
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.error = '';
    
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.loading = true;

    // Get tenantId from current site context
    const tenantId = this.tenantService.getTenantId();
    if (!tenantId) {
      this.error = 'Unable to determine site context. Please try again.';
      this.loading = false;
      return;
    }

    // End User login - only accepts EndUser role
    this.authService.login('EndUser', this.email, this.password, tenantId).subscribe({
      next: (userContext) => {
        if (userContext.role === 'EndUser') {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `/site/${this.slug}/account`;
          this.router.navigate([returnUrl]);
        } else {
          this.error = 'Access denied. End User account required.';
          this.authService.logout();
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

