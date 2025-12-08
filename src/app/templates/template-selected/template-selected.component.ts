import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService, Template } from '../../core/services/templates.service';
import { TemplateDraftService } from '../../core/services/template-draft.service';
import { CustomizationService } from '../../core/services/customization.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TemplateContextService } from '../../core/services/template-context.service';
import { TemplateFlowService } from '../../core/services/template-flow.service';
import { HeaderComponent } from '../components/header/header.component';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { CategorySectionComponent } from '../components/category-section/category-section.component';
import { FooterComponent } from '../components/footer/footer.component';
import { EditPanelComponent } from '../components/edit-panel/edit-panel.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-selected',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSectionComponent,
    CategorySectionComponent,
    FooterComponent,
    EditPanelComponent
  ],
  templateUrl: './template-selected.component.html',
  styleUrls: ['./template-selected.component.css']
})
export class TemplateSelectedComponent implements OnInit, OnDestroy {
  template?: Template | any;
  templateId?: number;
  templateSlug?: string;
  loading = true;
  errorMessage = '';
  private authSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templatesService: TemplatesService,
    private draftService: TemplateDraftService,
    private customizationService: CustomizationService,
    private authService: AuthenticationService,
    public templateContext: TemplateContextService,
    private templateFlowService: TemplateFlowService
  ) {}

  getPrimaryButtonLabel(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return "Publish Website";
    const tenantId = Number(user.tenantId);
    if (tenantId === 5) return "Publish Website";
    if (tenantId > 5) return "Go to Admin Panel";
    return "Publish Website";
  }

  getSecondaryButtonLabel(): string | null {
    const user = this.authService.getCurrentUser();
    if (!user) return null;
    const tenantId = Number(user.tenantId);
    if (tenantId === 5) return "Go to Admin Panel (Preview)";
    return null;
  }

  goToPreviewAdmin() {
    this.router.navigate(['/admin/dashboard/overview'], { queryParams: { preview: true } });
  }

  ngOnInit() {
    // Subscribe to auth state changes to trigger change detection
    this.authSubscription = this.authService.currentUser$.subscribe(() => {
      // This will trigger change detection when user state changes
    });

    // Read query params
    this.route.queryParams.subscribe(params => {
      const id = params['id'] ? Number(params['id']) : null;
      const slug = params['slug'] || null;

      // Save to localStorage if they exist
      if (id) {
        localStorage.setItem("selectedTemplateId", id.toString());
        this.templateId = id;
        this.loadTemplateById(id);
      } else if (slug) {
        localStorage.setItem("selectedTemplateSlug", slug);
        this.templateSlug = slug;
        this.loadTemplateBySlug(slug);
      } else {
        // Try to restore from localStorage
        const savedId = localStorage.getItem("selectedTemplateId");
        const savedSlug = localStorage.getItem("selectedTemplateSlug");
        
        if (savedId) {
          this.templateId = Number(savedId);
          this.loadTemplateById(this.templateId);
        } else if (savedSlug) {
          this.templateSlug = savedSlug;
          this.loadTemplateBySlug(this.templateSlug);
        } else {
          this.errorMessage = 'Template ID or slug is required.';
          this.loading = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
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
        this.enableEditMode();
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
        this.enableEditMode();
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

  enableEditMode() {
    this.customizationService.isEditMode = true;
  }

  getSlugFromTemplate(template: Template | any): string {
    if (template.slug) return template.slug;
    if (template.name) {
      return template.name.toLowerCase().replace(/\s+/g, '-');
    }
    return '';
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
}
