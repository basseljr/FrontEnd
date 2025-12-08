import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TemplatesService, Template } from '../../core/services/templates.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TemplateDraftService } from '../../core/services/template-draft.service';
import { CustomizationService } from '../../core/services/customization.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TemplateFlowService } from '../../core/services/template-flow.service';



@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent implements OnInit {

  template?: Template | any;
  templateId?: number;
  templateSlug?: string;
  loading = true;
  errorMessage = '';

 constructor(
  private route: ActivatedRoute,
  private templatesService: TemplatesService,
  private router: Router,
  private draftService: TemplateDraftService,
  private customizationService: CustomizationService,
  private authService: AuthenticationService,
  private templateFlowService: TemplateFlowService
) {}

  getPublishButtonText(): string {
    const user = this.authService.getCurrentUser();
    if (user && Number(user.tenantId) > 5) {
      return 'Go to Admin Panel';
    }
    return 'Publish Website';
  }

  ngOnInit() {
    // Read query params instead of route params
    this.route.queryParams.subscribe(params => {
      const id = params['id'] ? Number(params['id']) : null;
      const slug = params['slug'] || null;

      if (id) {
        this.templateId = id;
        this.loadTemplateById(id);
      } else if (slug) {
        this.templateSlug = slug;
        this.loadTemplateBySlug(slug);
      } else {
        this.errorMessage = 'Template ID or slug is required.';
        this.loading = false;
      }
    });
  }

  

  loadTemplateById(id: number) {
    this.templatesService.getTemplate(id).subscribe({
      next: (data) => {
        this.template = data;
        this.templateId = data.id;
        this.templateSlug = this.getSlugFromTemplate(data);
        
        // Save to localStorage when template loads
        if (this.templateId) {
          localStorage.setItem("selectedTemplateId", this.templateId.toString());
        }
        if (this.templateSlug) {
          localStorage.setItem("selectedTemplateSlug", this.templateSlug);
        }
        
        this.loadCustomizationData();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Template not found.';
        this.loading = false;
      }
    });
  }

  loadTemplateBySlug(slug: string) {
    this.templatesService.getTemplateBySlug(slug).subscribe({
      next: (data: any) => {
        this.template = data;
        this.templateId = data.id || data.templateId;
        this.templateSlug = slug;
        
        // Save to localStorage when template loads
        if (this.templateId) {
          localStorage.setItem("selectedTemplateId", this.templateId.toString());
        }
        if (this.templateSlug) {
          localStorage.setItem("selectedTemplateSlug", this.templateSlug);
        }
        
        this.loadCustomizationData();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Template not found.';
        this.loading = false;
      }
    });
  }

  loadCustomizationData() {
    if (!this.templateId) return;

    // Check for existing draft
    const draft = this.draftService.loadDraft();
    const draftTemplateId = this.draftService.getTemplateId();

    if (draft && draftTemplateId === this.templateId) {
      // Load draft into customization service
      this.customizationService.loadData(draft);
    } else {
      // Load default customization from template
      const defaultCustomization = this.template?.defaultCustomization || 
                                    this.template?.customizationData || 
                                    null;
      if (defaultCustomization) {
        this.customizationService.loadData(defaultCustomization);
      }
    }

    // Store template info in customization service
    this.customizationService.currentTemplateId = this.templateId;
    this.customizationService.currentTemplateSlug = this.templateSlug;
  }

  getSlugFromTemplate(template: Template | any): string {
    if (template.slug) return template.slug;
    if (template.name) {
      return template.name.toLowerCase().replace(/\s+/g, '-');
    }
    return '';
  }

  customizeTemplate() {
    if (!this.templateId || !this.templateSlug) return;
    
    // Save template ID and slug to localStorage before navigating
    localStorage.setItem("selectedTemplateId", this.templateId.toString());
    localStorage.setItem("selectedTemplateSlug", this.templateSlug);
    
    this.router.navigate(['/template-selected'], {
      queryParams: { id: this.templateId, slug: this.templateSlug }
    });
  }

  publishTemplate() {
    const user = this.authService.getCurrentUser();

    // Case A: Not logged in → redirect to login
    if (!user) {
      this.router.navigate(['/login'], { queryParams: { fromPreview: true } });
      return;
    }

    const tenantId = Number(user.tenantId);

    // Case C: Real tenant → redirect to admin dashboard
    if (tenantId > 5) {
      this.router.navigate(['/admin/dashboard/overview']);
      return;
    }

    // Case B: Preview user → save draft and redirect to preview dashboard
    if (tenantId === 5) {
      const templateId = this.templateId || this.draftService.getTemplateId();
      if (!templateId) {
        alert('Template ID is required.');
        return;
      }

      const customizationData = this.customizationService.getCurrentData();
      if (!customizationData) {
        alert('No customization data found. Please customize the template first.');
        return;
      }

      this.templateFlowService.saveDraft(templateId, customizationData).subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard/overview'], { queryParams: { preview: true } });
        },
        error: (err) => {
          console.error('Save draft failed:', err);
          alert(err.error?.message || 'Failed to save draft. Please try again.');
        }
      });
      return;
    }

    // Fallback: redirect to login
    this.router.navigate(['/login'], { queryParams: { fromPreview: true } });
  }

  getDemoLink(): string[] {
    if (this.templateSlug) {
      return ['/demo', this.templateSlug];
    }
    if (this.template?.name) {
      const slug = this.template.name.toLowerCase().replace(/\s+/g, '-');
      return ['/demo', slug];
    }
    return ['/demo', 'default'];
  }

}
