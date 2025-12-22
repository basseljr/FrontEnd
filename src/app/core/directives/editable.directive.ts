import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CustomizationService } from '../services/customization.service';
import { AuthenticationService } from '../services/authentication.service';
import { TemplateContextService } from '../services/template-context.service';

@Directive({
  selector: '[appEditable]',
  standalone: true // ✅ make it standalone so you can import directly
})
export class EditableDirective {
  @Input() editableType!: 'text' | 'background' | 'image';
  @Input() section!: string;
  @Input() key!: string;

  constructor(
    private el: ElementRef, 
    private customization: CustomizationService,
    private authService: AuthenticationService,
    private templateContext: TemplateContextService
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const user = this.authService.getCurrentUser();
    // Real tenant - allow editing only if editMode=true query param is present
    if (user && Number(user.tenantId) > 5) {
      if (!this.templateContext.isEditMode()) {
        // Real tenant without editMode param - don't activate editor
        return;
      }
      // Real tenant with editMode=true - allow editing
    }
    
    // Only intercept clicks if edit mode is enabled AND panel is open
    // If panel is closed, allow normal navigation/click behavior
    if (!this.customization.isEditMode || !this.customization.isPanelOpen) {
      return; // allow normal navigation
    }
    
    event.stopPropagation();

    this.customization.selectElement({
      type: this.editableType,
      section: this.section,
      key: this.key
    });

    // Handle image editing directly
    if (this.editableType === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            this.customization.update(this.section, this.key, base64);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  }
}
