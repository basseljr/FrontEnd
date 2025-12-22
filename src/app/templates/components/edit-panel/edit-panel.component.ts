import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../../core/services/customization.service';
import { TemplateLoaderService } from '../../../core/services/template-loader.service';
import { TemplateDraftService } from '../../../core/services/template-draft.service';
import { TemplateContextService } from '../../../core/services/template-context.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TemplateFlowService } from '../../../core/services/template-flow.service';

@Component({
  selector: 'app-edit-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.css']
})
export class EditPanelComponent implements OnInit {
  selected: any = null;
  saving = false;
  isPreviewMode = false;

  constructor(
    public customization: CustomizationService,
    private loader: TemplateLoaderService,
    private draft: TemplateDraftService,
    public templateContext: TemplateContextService,
    private authService: AuthenticationService,
    public templateFlow: TemplateFlowService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();

    // Real tenant → disable edit mode UNLESS editMode=true query param is present
    if (user && Number(user.tenantId) > 5) {
      // Allow edit mode only if explicitly enabled via query param
      if (!this.templateContext.isEditMode()) {
        this.customization.isEditMode = false;
        this.customization.closePanel();
        return;
      }
      // If editMode=true, open panel automatically for tenant owners
      if (this.customization.isEditMode) {
        this.customization.openPanel();
      }
    }

    this.isPreviewMode = this.templateContext.isTemplatePreview();
    this.customization.selectedElement.subscribe(sel => this.selected = sel);

    this.templateContext.mode$.subscribe(() => {
      this.isPreviewMode = this.templateContext.isTemplatePreview();
    });

    // Subscribe to editMode changes to auto-open panel
    // Note: This is a workaround since isEditMode is not observable
    // The panel will open when editMode is first enabled
  }

  update(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) this.customization.update(section, key, input.value);
  }

  updateColor(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) this.customization.update(section, key, input.value);
  }

  toggleEditMode() {
    // Toggle panel visibility only, not edit mode
    // Edit mode is controlled by query param and should persist
    this.customization.togglePanel();
  }

  isRealTenant(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && Number(user.tenantId) > 5);
  }

  saveCustomization() {
    const user = this.authService.getCurrentUser();

    // Real tenant → save via TemplateLoaderService (for live site customization)
    if (user && Number(user.tenantId) > 5) {
      if (this.templateContext.isEditMode()) {
        this.saving = true;
        this.loader.saveCustomization().subscribe({
          next: () => {
            this.saving = false;
            alert('Customization saved successfully!');
          },
          error: (err) => {
            console.error('Save failed', err);
            this.saving = false;
            alert('Failed to save customization. Please try again.');
          }
        });
      }
      return;
    }

    this.saving = true;
    const customizationData = this.customization.getCurrentData();
    const templateId = this.customization.currentTemplateId;

    // NOT LOGGED IN → localStorage only
    if (!user) {
      this.draft.saveDraft(templateId!, customizationData);
      this.saving = false;
      alert('Changes saved to draft!');
      return;
    }

    const tenantId = Number(user.tenantId);

    // PREVIEW USER → save to backend draft table (create or update)
    if (tenantId === 5) {
      this.templateFlow.updateOrCreateDraft(templateId!, customizationData).subscribe({
        next: () => {
          // Also save locally for preview persistence
          this.draft.saveDraft(templateId!, customizationData);
          this.saving = false;
          alert('Changes saved to draft!');
        },
        error: (err: any) => {
          console.error('Draft save failed:', err);
          this.saving = false;
          alert('Failed to save draft. Please try again.');
        }
      });
      return;
    }

    // Fallback (should not happen)
    this.saving = false;
  }

}
