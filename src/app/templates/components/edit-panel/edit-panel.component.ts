import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../../core/services/customization.service';
import { TemplateLoaderService } from '../../../core/services/template-loader.service';

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

  constructor(
    public customization: CustomizationService,
    private loader: TemplateLoaderService
  ) {}

  ngOnInit() {
    this.customization.selectedElement.subscribe(sel => (this.selected = sel));
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

  /** Save tenant customization to backend */
  saveCustomization() {
    const tenantId = 1; // 🔹 Replace with real tenantId (from auth/session)
    this.saving = true;

    this.loader.saveCustomization(tenantId).subscribe({
      next: () => {
        this.saving = false;
        alert('Customization saved successfully!');
      },
      error: (err) => {
        this.saving = false;
        console.error('Error saving customization', err);
        alert('Failed to save customization');
      }
    });
  }
}
