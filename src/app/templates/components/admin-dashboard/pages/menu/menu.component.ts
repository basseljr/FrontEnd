import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../../../core/services/menu.service';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { TenantService } from '../../../../../core/services/tenant.service';
import { MenuItem } from '../../../../../core/models/menu-item.model';
import { Category } from '../../../../../core/models/category.model';
import { AddEditItemFormComponent } from '../../components/add-edit-item-form/add-edit-item-form.component';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEditItemFormComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  selectedItem: MenuItem | null = null;
  isFormOpen = false;
  loading = true;
  error = '';
  constructor(
    private menuService: MenuService,
    private categoriesService: CategoriesService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    // Wait for tenant to be ready before loading data
    this.tenantService.isReady().pipe(
      filter(ready => ready === true),
      take(1)
    ).subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.menuService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.onCategoryFilter();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load menu items';
        this.loading = false;
      }
    });

    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });
  }


  onCategoryFilter() {
    const categoryId = Number(this.selectedCategoryId);

    if (categoryId === 0) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => item.categoryId === categoryId);
    }
  }


  addItem() {
    this.selectedItem = null;
    this.isFormOpen = true;
  }

  editItem(item: MenuItem) {
    this.selectedItem = item;
    this.isFormOpen = true;
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.deleteItem(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: () => {
          this.error = 'Failed to delete item';
        }
      });
    }
  }

  getStatusText(item: MenuItem): string {
    if (item.isTrackStock === false) {
      return 'Available';
    }
    if (item.stockQuantity === 0) {
      return 'Out of Stock';
    }
    if (item.stockQuantity && item.stockQuantity < 5) {
      return 'Low Stock';
    }
    return 'Available';
  }

  getStatusBadgeClass(item: MenuItem): string {
    if (item.isTrackStock === false) {
      return 'bg-success';
    }
    if (item.stockQuantity === 0) {
      return 'bg-danger';
    }
    if (item.stockQuantity && item.stockQuantity < 5) {
      return 'bg-warning';
    }
    return 'bg-success';
  }

  toggleAvailability(item: MenuItem) {
    // If stockQuantity is 0 and isTrackStock is true, force disable automatically
    if (item.stockQuantity === 0 && item.isTrackStock === true) {
      // Already disabled, cannot enable if stock is 0
      this.error = 'Cannot enable item with zero stock. Please update stock quantity first.';
      return;
    }
    
    const newAvailability = !item.isAvailable;
    
    this.menuService.toggleAvailability(item.id!, newAvailability).subscribe({
      next: () => {
        item.isAvailable = newAvailability;
      },
      error: () => {
        this.error = 'Failed to update availability';
      }
    });
  }

  saveItem(item: MenuItem) {
    if (item.id) {
      this.menuService.updateItem(item.id, item).subscribe({
        next: () => {
          this.loadData();
          this.isFormOpen = false;
        },
        error: () => {
          this.error = 'Failed to update item';
        }
      });
    } else {
      this.menuService.addItem(item).subscribe({
        next: () => {
          this.loadData();
          this.isFormOpen = false;
        },
        error: () => {
          this.error = 'Failed to add item';
        }
      });
    }
  }

  closeForm() {
    this.isFormOpen = false;
    this.selectedItem = null;
  }

  trackByItemId(index: number, item: MenuItem): number | undefined {
    return item.id;
  }
}

