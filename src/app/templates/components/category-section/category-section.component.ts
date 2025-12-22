
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';
import { Category } from '../../../core/models/category.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { TemplateContextService } from '../../../core/services/template-context.service';

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
  templateSlug: string = 'restaurant-menu';

  // For API feedback
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customization: CustomizationService,
    private categoriesService: CategoriesService,
    private authService: AuthenticationService,
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    // 1. Load customization mode (demo/customization mode)
    this.customization.currentData.subscribe(data => {
      this.customData = data.categories || {};
      if (data.categories?.items) {
        // Template mode → use template JSON
        this.categories = data.categories.items;
      }
    });
  
    // 2. Load real DB categories when tenant is resolved
    this.loading = true;
  
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Real tenant categories override demo ones
          // Sort by displayOrder for live site (ascending)
          this.categories = data.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load categories from server.';
        this.loading = false;
      }
    });

    // Get slug from route params (for demo/site routes) or from customization service (for template-selected)
    this.route.parent?.params.subscribe(params => {
      if (params['slug']) {
        this.templateSlug = params['slug'];
      }
    });

    // Also check customization service for template slug (used in template-selected)
    if (this.customization.currentTemplateSlug) {
      this.templateSlug = this.customization.currentTemplateSlug;
    }
  }
  

  openCategory1(id: string | number) {
    if (!this.customization.isEditMode) {
      const slug = this.templateSlug ?? 'restaurant-menu';
      const routePrefix = this.templateContext.isPublishedSite() ? '/site' : '/demo';
      this.router.navigate([routePrefix, slug, 'category', id]);
    }
  }

  openCategory(id: string | number) {
    const user = this.authService.getCurrentUser();
    const routePrefix = this.templateContext.isPublishedSite() ? '/site' : '/demo';
    const queryParams = this.templateContext.getPreservedQueryParams();
    
    if (user && Number(user.tenantId) > 5) {
      // Real tenant - allow normal navigation, preserve editMode if active
      this.router.navigate([routePrefix, this.templateSlug, 'category', id], {
        queryParams: queryParams
      });
      return;
    }
    if (!this.customization.isEditMode) {
      this.router.navigate([routePrefix, this.templateSlug, 'category', id], {
        queryParams: queryParams
      });
    }
  }
  
}

