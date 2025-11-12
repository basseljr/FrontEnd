import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CustomizationService } from '../services/customization.service';

@Directive({
  selector: '[appEditable]',
  standalone: true // ✅ make it standalone so you can import directly
})
export class EditableDirective {
  @Input() editableType!: 'text' | 'background' | 'image';
  @Input() section!: string;
  @Input() key!: string;

  constructor(private el: ElementRef, private customization: CustomizationService) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.customization.isEditMode) return;
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
