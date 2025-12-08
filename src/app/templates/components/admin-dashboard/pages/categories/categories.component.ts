import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { Category } from '../../../../../core/models/category.model';
import { AddEditCategoryFormComponent } from '../../components/add-edit-category-form/add-edit-category-form.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, DragDropModule, AddEditCategoryFormComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  isFormOpen = false;
  loading = true;
  error = '';
  isPreviewMode = false;

  constructor(
    private categoriesService: CategoriesService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check preview mode FIRST - before any API calls
    this.isPreviewMode = this.authService.isPreviewMode() || (this.route.snapshot.queryParamMap.get('preview') === 'true');

    if (this.isPreviewMode) {
      this.loadDummyData();
      return; // Exit early - no API calls
    }

    this.loadCategories();
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      this.categories = [
        { id: 1, name: 'Burgers', displayOrder: 1, isAvailable: true },
        { id: 2, name: 'Pizza', displayOrder: 2, isAvailable: true },
        { id: 3, name: 'Drinks', displayOrder: 3, isAvailable: true },
        { id: 4, name: 'Desserts', displayOrder: 4, isAvailable: true }
      ];
      this.loading = false;
    }, 500);
  }

  loadCategories() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  addCategory() {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    this.selectedCategory = null;
    this.isFormOpen = true;
  }

  editCategory(category: Category) {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    this.selectedCategory = category;
    this.isFormOpen = true;
  }

  deleteCategory(id: number) {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: () => {
          this.error = 'Failed to delete category';
        }
      });
    }
  }

  saveCategory(category: Category) {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    if (category.id) {
      this.categoriesService.updateCategory(category.id, category).subscribe({
        next: () => {
          this.loadCategories();
          this.isFormOpen = false;
        },
        error: () => {
          this.error = 'Failed to update category';
        }
      });
    } else {
      this.categoriesService.createCategory(category).subscribe({
        next: () => {
          this.loadCategories();
          this.isFormOpen = false;
        },
        error: () => {
          this.error = 'Failed to add category';
        }
      });
    }
  }

  closeForm() {
    this.isFormOpen = false;
    this.selectedCategory = null;
  }

  drop(event: CdkDragDrop<Category[]>) {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    // Update display order
    this.categories.forEach((cat, index) => {
      cat.displayOrder = index;
    });
    // Save new order
    this.categoriesService.updateCategoryOrder(this.categories).subscribe({
      error: () => {
        this.error = 'Failed to update category order';
      }
    });
  }

  toggleAvailability(category: Category, event: Event) {
    if (this.isPreviewMode) {
      event.preventDefault();
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;
    this.categoriesService.toggleAvailability(category.id, newValue).subscribe({
      next: () => {
        category.isAvailable = newValue;
      },
      error: () => {
        this.error = 'Failed to update category availability';
        // Revert the toggle
        target.checked = !newValue;
      }
    });
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }
}

