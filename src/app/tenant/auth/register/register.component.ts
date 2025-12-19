import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TemplateDraftService } from '../../../core/services/template-draft.service';
import { TemplateFlowService } from '../../../core/services/template-flow.service';

@Component({
  selector: 'app-tenant-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class TenantRegisterComponent implements OnInit {
  country = 'Kuwait';
  mobileNumber = '';
  name = '';
  email = '';
  password = '';
  agreeToTerms = false;
  loading = false;
  errors: { [key: string]: string } = {};

  countries = ['Kuwait', 'Saudi Arabia', 'UAE', 'Qatar', 'Bahrain', 'Oman'];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private draftService: TemplateDraftService,
    private templateFlowService: TemplateFlowService
  ) {}

  ngOnInit() {
    // If logged in already → go to proper dashboard
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
    this.errors = {};

    // Validate fields
    if (!this.name.trim()) this.errors['name'] = 'Name is required';
    if (!this.email.trim()) this.errors['email'] = 'Email is required';
    if (!this.mobileNumber.trim()) this.errors['mobile'] = 'Mobile number is required';
    if (!this.password.trim()) this.errors['password'] = 'Password is required';
    if (!this.agreeToTerms) this.errors['terms'] = 'You must agree to the Terms and Conditions';

    if (Object.keys(this.errors).length > 0) return;

    this.loading = true;

    const data = {
      fullName: this.name.trim(),
      email: this.email.trim(),
      mobile: "+965 " + this.mobileNumber.trim(),
      country: this.country,
      password: this.password,
      role: "Customer",
      templateId: Number(localStorage.getItem("selectedTemplateId"))
    };

    this.http.post(`${environment.apiUrl}/auth/tenant/register`, data).subscribe({
      next: (response: any) => {
        // Auto-login using returned JWT
        this.authService.storeLoginData(response);

        /*************************
         * CASE 1 — PUBLISH FLOW *
         *************************/
        const pending = localStorage.getItem("pendingPublish");

        if (pending === "true") {
          // Do NOT clear pendingPublish here
          const tid = localStorage.getItem("selectedTemplateId");
          const slug = localStorage.getItem("selectedTemplateSlug");

          if (tid && slug) {
            this.router.navigate(['/template-selected'], {
              queryParams: { id: tid, slug: slug }
            });
          } else {
            this.router.navigate(['/templates']);
          }

          this.loading = false;
          return;
        }

        /***************************************
         * CASE 2 — NORMAL REGISTRATION FLOW   *
         ***************************************/
        // Always save draft BEFORE redirecting
        const draft = this.draftService.loadDraft();
        const templateId = Number(localStorage.getItem("selectedTemplateId"));

        if (draft && templateId) {
          // Save draft in backend
          this.templateFlowService.updateOrCreateDraft(templateId, draft).subscribe({
            next: () => {
              // ensure user gets preview dashboard
              this.router.navigate(['/admin/dashboard/overview'], {
                queryParams: { preview: true }
              });
              this.loading = false;
            },
            error: (err) => {
              console.error("Failed to save draft on registration:", err);
              // Still redirect
              this.router.navigate(['/admin/dashboard/overview'], {
                queryParams: { preview: true }
              });
              this.loading = false;
            }
          });
        } else {
          // No draft found → still redirect normally
          this.router.navigate(['/admin/dashboard/overview'], {
            queryParams: { preview: true }
          });
          this.loading = false;
        }
      },

      error: (err) => {
        this.errors['general'] = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
