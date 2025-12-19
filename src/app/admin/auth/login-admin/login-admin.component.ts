import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Check if admin already logged in
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard/overview']);
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

    // Admin login - only accepts Admin role
    this.authService.login('Admin', this.email, this.password).subscribe({
      next: (userContext) => {
        if (userContext.role === 'Admin' && userContext.tenantId === 1) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard/overview';
          this.router.navigate([returnUrl]);
        } else {
          this.error = 'Access denied. Admin role required.';
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

