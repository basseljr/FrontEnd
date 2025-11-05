import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../../core/services/templates.service';

@Component({
  selector: 'app-template-selected',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="selected-container" *ngIf="selectedTemplate; else noSelection">
      <h2>You selected: {{ selectedTemplate.name }}</h2>
      <img [src]="selectedTemplate.previewImage" alt="{{ selectedTemplate.name }}" />
      <p>{{ selectedTemplate.description }}</p>
    </div>
    <ng-template #noSelection>
      <p>No template selected yet.</p>
    </ng-template>
  `,
  styles: [`
    .selected-container { text-align: center; margin-top: 40px; }
    img { width: 300px; border-radius: 10px; margin: 20px 0; }
  `]
})
export class TemplateSelectedComponent implements OnInit {
  selectedTemplate?: Template | null = null;

  ngOnInit() {
    const stored = localStorage.getItem('selectedTemplate');
    if (stored) {
      this.selectedTemplate = JSON.parse(stored);
    }
  }
}
