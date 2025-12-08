import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../../core/services/customization.service';
import { TemplateLoaderService } from '../../../core/services/template-loader.service';
import { TemplateDraftService } from '../../../core/services/template-draft.service';
import { TemplateContextService } from '../../../core/services/template-context.service';

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
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    this.isPreviewMode = this.templateContext.isTemplatePreview();
    this.customization.selectedElement.subscribe(sel => (this.selected = sel));
    
    // Watch context changes
    this.templateContext.mode$.subscribe(() => {
      this.isPreviewMode = this.templateContext.isTemplatePreview();
    });
  }

  /** Update for text fields */
  update(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.customization.update(section, key, input.value);
    }
  }

  /** Update for color pickers */
  updateColor(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.customization.update(section, key, input.value);
    }
  }

  toggleEditMode() {
    this.customization.toggleEditMode();
  }

  /** Save customization - draft in preview mode, backend in published sites */
  saveCustomization() {
    this.saving = true;
  
    const customizationData = this.customization.getCurrentData();
    const templateId = this.customization.currentTemplateId;
  
    if (this.isPreviewMode) {
      // Save to draft (template preview mode)
      this.draft.saveDraft(templateId!, customizationData);
      this.saving = false;
      alert('Changes saved to draft!');
    } else {
      // Save to backend (published site)
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
  }
  
}
