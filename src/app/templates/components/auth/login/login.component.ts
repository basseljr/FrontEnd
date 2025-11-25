import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  error = '';
  isAdminLogin = false;

  constructor(
    private authService: AuthService,
    private customerAuthService: CustomerAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Check if admin already logged in
    if (this.authService.isAuthenticated() && this.authService.isAdminOrOwner()) {
      this.router.navigate(['/admin']);
      return;
    }

    // Check if customer already logged in
    if (this.customerAuthService.isCustomerLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    // Check query param for admin login
    this.route.queryParams.subscribe(params => {
      this.isAdminLogin = params['type'] === 'admin';
    });
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    // Reset error
    this.error = '';
    
    // Validation
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.loading = true;

    if (this.isAdminLogin) {
      // Admin login
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          // Check if user is admin or owner
          if (this.authService.isAdminOrOwner()) {
            // Navigate to returnUrl or /admin
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
            if (returnUrl.startsWith('/admin')) {
              this.router.navigate([returnUrl]);
            } else {
              this.router.navigate(['/admin']);
            }
          } else {
            this.error = 'Access denied. Admin or Owner role required.';
            this.authService.logout();
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
    } else {
      // Customer login
      this.customerAuthService.login(this.email, this.password).subscribe({
        next: (customer) => {
          if (customer) {
            // Navigate to homepage or return URL (but not admin routes)
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            // Prevent redirecting to admin routes for customers
            if (returnUrl.startsWith('/admin')) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate([returnUrl]);
            }
          } else {
            this.error = 'Invalid email or password';
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

