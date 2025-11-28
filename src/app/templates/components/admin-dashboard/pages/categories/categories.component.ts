import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoriesService } from '../../../../../core/services/categories.service';
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

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
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
    this.selectedCategory = null;
    this.isFormOpen = true;
  }

  editCategory(category: Category) {
    this.selectedCategory = category;
    this.isFormOpen = true;
  }

  deleteCategory(id: number) {
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

