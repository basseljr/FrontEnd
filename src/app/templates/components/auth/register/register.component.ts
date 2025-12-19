import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerAuthService, CustomerData } from '../../../../core/services/customer-auth.service';
import { TemplateDraftService } from '../../../../core/services/template-draft.service';
import { TemplatesService } from '../../../../core/services/templates.service';
import { CustomizationService } from '../../../../core/services/customization.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  country = 'Kuwait';
  mobileNumber = '';
  name = '';
  email = '';
  password = '';
  agreeToTerms = false;
  loading = false;
  errors: { [key: string]: string } = {};
  fromPreview = false;

  countries = ['Kuwait', 'Saudi Arabia', 'UAE', 'Qatar', 'Bahrain', 'Oman'];

  constructor(
    private customerAuthService: CustomerAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private draftService: TemplateDraftService,
    private templatesService: TemplatesService,
    private customizationService: CustomizationService
  ) {}

  ngOnInit() {
    // Check if customer already logged in
    if (this.customerAuthService.isCustomerLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    // Check for fromPreview query param
    this.route.queryParams.subscribe(params => {
      this.fromPreview = params['fromPreview'] === 'true';
    });
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    // Reset errors
    this.errors = {};

    // Validation
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

    if (!this.agreeToTerms) {
      this.errors['terms'] = 'You must agree to the Terms & Conditions';
    }

    // If there are errors, stop
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.loading = true;

    const customerData: CustomerData = {
      name: this.name.trim(),
      email: this.email.trim(),
      mobile: `+965 ${this.mobileNumber.trim()}`,
      country: this.country,
      password: this.password // In real app, this would be hashed
    };

    this.customerAuthService.register(customerData).subscribe({
      next: () => {
        // Auto-login after registration
        this.customerAuthService.login(this.email, this.password).subscribe({
          next: () => {
            // If fromPreview, publish the draft
            if (this.fromPreview) {
              this.publishDraft(customerData);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            // Registration successful but auto-login failed
            if (this.fromPreview) {
              // Still try to publish if draft exists
              this.publishDraft(customerData);
            } else {
              this.router.navigate(['/login']);
            }
          }
        });
      },
      error: (err) => {
        this.errors['general'] = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  private publishDraft(customerData: CustomerData) {
    // Load draft from TemplateDraftService
    const draft = this.draftService.loadDraft();
    const templateId = this.draftService.getTemplateId();

    if (!draft || !templateId) {
      this.errors['general'] = 'No draft found to publish.';
      this.loading = false;
      return;
    }

    // Call publish API
    this.templatesService.publishTemplate(templateId, draft, customerData).subscribe({
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
          this.errors['general'] = 'Template published but subdomain not available.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Publish failed:', err);
        this.errors['general'] = err.error?.message || 'Failed to publish template. Please try again.';
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

