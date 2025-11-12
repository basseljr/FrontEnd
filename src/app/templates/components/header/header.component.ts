import { Component, OnInit } from '@angular/core';
import { CustomizationService } from '../../../core/services/customization.service';
import { CommonModule } from '@angular/common';
import { EditableDirective } from '../../../core/directives/editable.directive'; // 👈 add this

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditableDirective], // 👈 include it here

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  customData: any = {};

  constructor(private customization: CustomizationService) {}

  ngOnInit() {
    this.customization.currentData.subscribe(data => {
        console.log('Header data updated:', data.header);

      this.customData = data.header;
    });
  }
}
