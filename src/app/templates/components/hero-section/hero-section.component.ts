import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationService } from '../../../core/services/customization.service';
import { EditableDirective } from '../../../core/directives/editable.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit {
  customData: any = {};

  constructor(private customization: CustomizationService) {}

  ngOnInit() {
    this.customization.currentData.subscribe(data => {
      this.customData = data.hero || {};
    });
  }
}
