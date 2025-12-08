import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { TenantService } from '../../../../core/services/tenant.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-end-user-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class EndUserRegisterComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  mobileNumber = '';
  loading = false;
  errors: { [key: string]: string } = {};
  slug = '';

  constructor(
    private http: HttpClient,
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
    this.errors = {};

    if (!this.name.trim()) {
      this.errors['name'] = 'Name is required';
    }

    if (!this.email.trim()) {
      this.errors['email'] = 'Email is required';
    } else if (!this.isValidEmail(this.email)) {
      this.errors['email'] = 'Please enter a valid email address';
    }

    if (!this.mobileNumber.trim()) {
      this.errors['mobile'] = 'Mobile number is required';
    }

    if (!this.password.trim()) {
      this.errors['password'] = 'Password is required';
    } else if (this.password.length < 6) {
      this.errors['password'] = 'Password must be at least 6 characters';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.loading = true;

    // Get tenantId from current site context
    const tenantId = this.tenantService.getTenantId();
    if (!tenantId) {
      this.errors['general'] = 'Unable to determine site context. Please try again.';
      this.loading = false;
      return;
    }

    // Register as End User
    const registerData = {
      name: this.name.trim(),
      email: this.email.trim(),
      mobile: this.mobileNumber.trim(),
      password: this.password,
      role: 'EndUser',
      tenantId: tenantId
    };

    this.http.post(`${environment.apiUrl}/Auth/register`, registerData).subscribe({
      next: () => {
        // Auto-login after registration
        this.authService.login('EndUser', this.email, this.password, tenantId).subscribe({
          next: () => {
            this.router.navigate(['/site', this.slug, 'account']);
          },
          error: () => {
            this.router.navigate(['/site', this.slug, 'login']);
          }
        });
      },
      error: (err) => {
        this.errors['general'] = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

