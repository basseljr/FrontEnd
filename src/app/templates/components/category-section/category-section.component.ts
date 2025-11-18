// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute } from '@angular/router';
// import { EditableDirective } from '../../../core/directives/editable.directive';
// import { CustomizationService } from '../../../core/services/customization.service';

// @Component({
//   selector: 'app-category-section',
//   standalone: true,
//   imports: [CommonModule, EditableDirective],
//   templateUrl: './category-section.component.html',
//   styleUrl: './category-section.component.css'
// })
// export class CategorySectionComponent implements OnInit {
//   customData: any = {};
//   categories: any[] = [];

//   constructor(
//     private router: Router,
//     private route: ActivatedRoute, 
//     private customization: CustomizationService
//   ) {}

//   ngOnInit() {
//     this.customization.currentData.subscribe(data => {
//       this.customData = data.categories || {};
//       this.categories = this.customData.items || [];
//     });
//   }



// openCategory(id: string) {
//   if (!this.customization.isEditMode) {
//     this.router.navigate(['category', id], { relativeTo: this.route });
//   }
// }


// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';
import { CategoriesService, Category } from '../../../core/services/categories.service';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './category-section.component.html',
  styleUrls: ['./category-section.component.css']
})
export class CategorySectionComponent implements OnInit {
  customData: any = {};
  categories: Category[] = [];

  // For API feedback
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customization: CustomizationService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    // Load data from CustomizationService first (for demo/edit mode)
    this.customization.currentData.subscribe(data => {
      this.customData = data.categories || {};
      this.categories = this.customData.items || [];
    });

    // Then also load from DB (for real published sites)
    const templateId = 2; // You can make this dynamic later
    this.loading = true;

    this.categoriesService.getByTemplate(templateId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.categories = data;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load categories from server.';
        this.loading = false;
      }
    });
  }

  openCategory(id: string | number) {
    if (!this.customization.isEditMode) {
      this.router.navigate(['category', id], { relativeTo: this.route });
    }
  }
}

