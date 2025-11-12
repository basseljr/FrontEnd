import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.css'
})
export class CategorySectionComponent implements OnInit {
  customData: any = {};
  categories: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute, // ✅ Add this
    private customization: CustomizationService
  ) {}

  ngOnInit() {
    this.customization.currentData.subscribe(data => {
      this.customData = data.categories || {};
      this.categories = this.customData.items || [];
    });
  }

// openCategory(id: string) {
//   if (!this.customization.isEditMode) {
//     const templateName = this.route.snapshot.paramMap.get('templateName');
//     this.router.navigate([`/demo/${templateName}/category`, id]);
//   }
// }

openCategory(id: string) {
  if (!this.customization.isEditMode) {
    this.router.navigate(['category', id], { relativeTo: this.route });
  }
}


}
