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
        // Check if login was triggered by publish flow
        const pendingPublish = localStorage.getItem("pendingPublish");
        if (pendingPublish === "true") {
          // Get template info from localStorage
          const selectedTemplateId = localStorage.getItem("selectedTemplateId");
          const selectedTemplateSlug = localStorage.getItem("selectedTemplateSlug");
          
          if (selectedTemplateId && selectedTemplateSlug) {
            // Navigate to template-selected to continue publish flow
            // Don't remove pendingPublish flag here - template-selected will handle it
            this.router.navigate(['/template-selected'], {
              queryParams: { id: selectedTemplateId, slug: selectedTemplateSlug }
            });
          } else {
            // Fallback if template info is missing
            localStorage.removeItem("pendingPublish");
            this.router.navigate(['/templates']);
          }
          this.loading = false;
          return;
        }

        // Normal login flow - clear pendingPublish if exists
        localStorage.removeItem("pendingPublish");
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

