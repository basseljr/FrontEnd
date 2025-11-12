import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  customData: any = {};

  constructor(private customization: CustomizationService) {}

  ngOnInit() {
    this.customization.currentData.subscribe(data => {
      this.customData = data.footer || {};
    });
  }
}
