import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tenant-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class TenantLoginComponent implements OnInit {
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
    // Check if tenant owner already logged in
    if (this.authService.isAuthenticated() && this.authService.isTenantOwner()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        const tenantId = Number(user.tenantId);
        if (tenantId === 5) {
          this.router.navigate(['/admin/dashboard/overview'], { queryParams: { preview: true } });
        } else if (tenantId > 5) {
          this.router.navigate(['/admin/dashboard/overview']);
        }
      }
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

    this.authService.login("Customer", this.email, this.password).subscribe({
      next: (user) => {
        const tenantId = Number(user.tenantId);

        if (tenantId === 5) {
          this.router.navigate(['/admin/dashboard/overview'], { queryParams: { preview: true }});
        } else if (tenantId > 5) {
          this.router.navigate(['/admin/dashboard/overview']);
        } else {
          this.router.navigate(['/templates']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }



  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

