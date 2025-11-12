import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../../core/services/customization.service';

@Component({
  selector: 'app-edit-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-panel.component.html',
  styleUrl: './edit-panel.component.css'
})
export class EditPanelComponent implements OnInit {
  selected: any = null;

  constructor(public customization: CustomizationService) {}

  ngOnInit() {
    this.customization.selectedElement.subscribe(sel => this.selected = sel);
  }

  /** Generic update for text or any simple string property */
  update(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      console.log('updateColor called for', section, key, input.value);
      this.customization.update(section, key, input.value);
    }
  }

  /** Update for color inputs */
  updateColor(section: string, key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.customization.update(section, key, input.value);
    }
  }

  toggleEditMode() {
  this.customization.toggleEditMode();
}

}
