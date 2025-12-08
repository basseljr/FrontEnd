import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service';
import { TemplateDraftService } from '../../../../core/services/template-draft.service';
import { TemplatesService } from '../../../../core/services/templates.service';
import { CustomizationService } from '../../../../core/services/customization.service';
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
  continuePublish = false;

  constructor(
    private authService: AuthService,
    private customerAuthService: CustomerAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private draftService: TemplateDraftService,
    private templatesService: TemplatesService,
    private customizationService: CustomizationService
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

    // Check query params
    this.route.queryParams.subscribe(params => {
      this.isAdminLogin = params['type'] === 'admin';
      this.continuePublish = params['continuePublish'] === 'true';
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
            // If continuePublish, publish draft first
            if (this.continuePublish) {
              this.publishDraft();
            } else {
              // Navigate to returnUrl or /admin
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
              if (returnUrl.startsWith('/admin')) {
                this.router.navigate([returnUrl]);
              } else {
                this.router.navigate(['/admin']);
              }
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
            // If continuePublish, publish draft first
            if (this.continuePublish) {
              this.publishDraft();
            } else {
              // Navigate to homepage or return URL (but not admin routes)
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
              // Prevent redirecting to admin routes for customers
              if (returnUrl.startsWith('/admin')) {
                this.router.navigate(['/']);
              } else {
                this.router.navigate([returnUrl]);
              }
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

  private publishDraft() {
    // Load draft from TemplateDraftService
    const draft = this.draftService.loadDraft();
    const templateId = this.draftService.getTemplateId();

    if (!draft || !templateId) {
      this.error = 'No draft found to publish.';
      this.loading = false;
      return;
    }

    // Get user data from current user
    const currentUser = this.authService.getCurrentUser();
    const customer = this.customerAuthService.getCurrentCustomer();
    
    const userData = currentUser ? {
      name: currentUser.email, // Admin might not have name
      email: currentUser.email,
      mobile: '',
      country: '',
      password: '' // Not needed for existing user
    } : customer ? {
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
      country: customer.country,
      password: '' // Not needed for existing user
    } : null;

    if (!userData) {
      this.error = 'User data not available.';
      this.loading = false;
      return;
    }

    // Call publish API
    this.templatesService.publishTemplate(templateId, draft, userData).subscribe({
      next: (response: any) => {
        // Clear draft after successful publish
        this.draftService.clearDraft();
        
        // Extract subdomain from response
        const subdomain = response.subdomain || response.tenantSubdomain || '';
        
        if (subdomain) {
          // Redirect to new tenant admin
          window.location.href = `https://${subdomain}.aiw.com/admin`;
        } else {
          // Fallback if subdomain not in response
          this.error = 'Template published but subdomain not available.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Publish failed:', err);
        this.error = err.error?.message || 'Failed to publish template. Please try again.';
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

