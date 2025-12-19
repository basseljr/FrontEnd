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
import { Subscription, catchError, of } from 'rxjs';

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
    this.authSubscription = this.authService.currentUser$.subscribe(() => {});

    this.route.queryParams.subscribe(params => {
      const id = params['id'] ? Number(params['id']) : null;
      const slug = params['slug'] || null;

      if (id) {
        localStorage.setItem("selectedTemplateId", id.toString());
        this.templateId = id;
        this.loadTemplateById(id);

      } else if (slug) {
        localStorage.setItem("selectedTemplateSlug", slug);
        this.templateSlug = slug;
        this.loadTemplateBySlug(slug);

      } else {
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

        localStorage.setItem("selectedTemplateId", String(this.templateId));
        localStorage.setItem("selectedTemplateSlug", this.templateSlug);

        this.loadCustomizationData();
        this.enableEditMode();
        this.loading = false;

        this.checkPendingPublish();
      },
      error: () => {
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

        localStorage.setItem("selectedTemplateId", String(this.templateId));
        localStorage.setItem("selectedTemplateSlug", this.templateSlug);

        this.loadCustomizationData();
        this.enableEditMode();
        this.loading = false;

        this.checkPendingPublish();
      },
      error: () => {
        this.errorMessage = 'Template not found.';
        this.loading = false;
      }
    });
  }

  getSlugFromTemplate(template: Template | any): string {
    if (template.slug) return template.slug;
    if (template.name) return template.name.toLowerCase().replace(/\s+/g, '-');
    return '';
  }

  loadCustomizationData() {
    if (!this.templateId) return;
    if (this.isEditingDisabled()) return;

    const draft = this.draftService.loadDraft();
    const draftTemplateId = this.draftService.getTemplateId();

    if (draft && draftTemplateId === this.templateId) {
      this.customizationService.loadData(draft);

    } else {
      const defaultCustomization =
        this.template?.defaultCustomization ||
        this.template?.customizationData ||
        null;

      if (defaultCustomization) {
        this.customizationService.loadData(defaultCustomization);
      }
    }

    this.customizationService.currentTemplateId = this.templateId;
    this.customizationService.currentTemplateSlug = this.templateSlug;
  }

  enableEditMode() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.customizationService.isEditMode = true;
      return;
    }

    const tenantId = Number(user.tenantId);

    if (tenantId === 5) this.customizationService.isEditMode = true;
    else if (tenantId > 5) this.customizationService.isEditMode = false;
    else this.customizationService.isEditMode = true;
  }

  isEditingDisabled(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    return Number(user.tenantId) > 5;
  }

  checkPendingPublish() {
    const pending = localStorage.getItem("pendingPublish");
    const user = this.authService.getCurrentUser();

    if (pending === "true" && user && Number(user.tenantId) === 5) {
      this.continuePublishFlow();
    }
  }

  publishTemplate() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      localStorage.setItem("pendingPublish", "true");
      this.router.navigate(['/login'], { queryParams: { fromPreview: true } });
      return;
    }

    if (Number(user.tenantId) > 5) {
      this.router.navigate(['/admin/dashboard/overview']);
      return;
    }

    this.continuePublishFlow();
  }

  /** FIXED VERSION USING NEW BACKEND ENDPOINTS */
  continuePublishFlow() {
    const user = this.authService.getCurrentUser();
    if (!user) return alert("Login required");

    const templateId = this.templateId || this.draftService.getTemplateId();
    const customization = this.customizationService.getCurrentData();

    if (!templateId || !customization) {
      alert("Missing template or customization");
      return;
    }

    const email = user.email;

    // 1️⃣ Check if user already has a draft in DB
    this.templateFlowService.getUserDraft(email)
      .pipe(catchError(() => of(null)))
      .subscribe((existingDraft: any) => {

        const save$ = 
          this.templateFlowService.updateOrCreateDraft(templateId, customization);

        save$.subscribe({
          next: (res: any) => {
            const draftId = res?.id;
            let userEmail: any = user.email;

            // FIX 1 → if email is array, pick the first
            if (Array.isArray(userEmail)) {
              userEmail = userEmail[0];
            }
            
            // FIX 2 → remove duplicated comma emails
            if (typeof userEmail === "string" && userEmail.includes(",")) {
              userEmail = userEmail.split(",")[0].trim();
            }
            // 2️⃣ Create tenant using draft ID
            this.templateFlowService.createTenantFromDraft(draftId, userEmail, '', 'basic')
              .subscribe({
                next: (tenantResponse: any) => {
                  if (tenantResponse?.tenantId) {
                    this.authService.updateTenantId(tenantResponse.tenantId);
                  }

                  if (tenantResponse?.subdomain) {
                    localStorage.setItem("tenantSubdomain", tenantResponse.subdomain);
                  }

                  localStorage.removeItem("pendingPublish");
                  this.draftService.clearDraft();

                  this.router.navigate(['/admin/dashboard/overview']);
                },
                error: (err) => {
                  console.error("Create tenant failed", err);
                  alert("Failed to publish website.");
                }
              });
          },
          error: (err) => {
            console.error("Save draft failed", err);
            alert("Failed to save draft.");
          }
        });
      });
  }
}
