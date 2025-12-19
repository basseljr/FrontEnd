import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { InventoryItem } from '../../../../../core/models/inventory.model';
import { TenantService } from '../../../../../core/services/tenant.service';
import { AuthenticationService } from '../../../../../core/services/authentication.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [];
  filteredInventory: InventoryItem[] = [];
  searchTerm = '';
  loading = true;
  error = '';
  isPreviewMode = false;
  
  // Edit modal
  selectedItem: InventoryItem | null = null;
  editStockQuantity = 0;
  isEditModalOpen = false;
  
  // Bulk update modal
  isBulkModalOpen = false;
  bulkUpdateItems: { id: number; stockQuantity: number; name: string }[] = [];

  constructor(
    private inventoryService: InventoryService,
    private tenantService: TenantService,
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

    // Wait for tenant to be ready before loading data
    this.tenantService.isReady().pipe(
      filter(ready => ready === true),
      take(1)
    ).subscribe(() => {
      this.loadInventory();
    });
  }

  loadDummyData() {
    this.loading = true;
    setTimeout(() => {
      this.inventory = [
        { id: 1, name: 'Beef Patty', categoryId: 1, categoryName: 'Meat', stockQuantity: 50, isTrackStock: true, isAvailable: true },
        { id: 2, name: 'Cheese', categoryId: 2, categoryName: 'Dairy', stockQuantity: 30, isTrackStock: true, isAvailable: true },
        { id: 3, name: 'Lettuce', categoryId: 3, categoryName: 'Vegetables', stockQuantity: 20, isTrackStock: true, isAvailable: true },
        { id: 4, name: 'Bread Buns', categoryId: 4, categoryName: 'Bakery', stockQuantity: 100, isTrackStock: true, isAvailable: true }
      ];
      this.filteredInventory = this.inventory;
      this.loading = false;
    }, 500);
  }

  loadInventory() {
    if (this.isPreviewMode) {
      return; // Don't call APIs in preview mode
    }
    this.loading = true;
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.filteredInventory = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load inventory';
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredInventory = this.inventory;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredInventory = this.inventory.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.categoryName.toLowerCase().includes(term)
    );
  }

  getStatusBadge(item: InventoryItem): { text: string; class: string } {
    if (!item.isTrackStock) {
      return { text: 'Available', class: 'bg-success' };
    }
    if (item.stockQuantity === 0) {
      return { text: 'Out of Stock', class: 'bg-danger' };
    }
    if (item.stockQuantity < 5) {
      return { text: 'Low Stock', class: 'bg-warning' };
    }
    return { text: 'Available', class: 'bg-success' };
  }

  openEditModal(item: InventoryItem) {
    this.selectedItem = item;
    this.editStockQuantity = item.stockQuantity;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedItem = null;
    this.editStockQuantity = 0;
  }

  saveStock() {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    if (!this.selectedItem) return;
    
    this.inventoryService.updateStock(this.selectedItem.id, this.editStockQuantity).subscribe({
      next: () => {
        this.selectedItem!.stockQuantity = this.editStockQuantity;
        // Update isAvailable if stockQuantity is 0
        if (this.editStockQuantity === 0 && this.selectedItem!.isTrackStock) {
          this.selectedItem!.isAvailable = false;
        }
        this.loadInventory();
        this.closeEditModal();
      },
      error: () => {
        this.error = 'Failed to update stock';
      }
    });
  }

  openBulkModal() {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    this.bulkUpdateItems = this.inventory
      .filter(item => item.isTrackStock)
      .map(item => ({
        id: item.id,
        stockQuantity: item.stockQuantity,
        name: item.name
      }));
    this.isBulkModalOpen = true;
  }

  closeBulkModal() {
    this.isBulkModalOpen = false;
    this.bulkUpdateItems = [];
  }

  saveBulkUpdate() {
    if (this.isPreviewMode) {
      alert('Preview mode: Changes are disabled. Publish your website to activate full features.');
      return;
    }
    const itemsToUpdate = this.bulkUpdateItems.map(item => ({
      id: item.id,
      stockQuantity: item.stockQuantity
    }));

    this.inventoryService.bulkUpdateStock(itemsToUpdate).subscribe({
      next: () => {
        this.loadInventory();
        this.closeBulkModal();
      },
      error: () => {
        this.error = 'Failed to update stock';
      }
    });
  }

  exportToCSV() {
    const csvData: string[] = [];
    csvData.push('Item Name,Category,Stock Quantity,Status');
    
    this.filteredInventory.forEach(item => {
      const status = this.getStatusBadge(item).text;
      csvData.push(`"${item.name}","${item.categoryName}",${item.stockQuantity},"${status}"`);
    });

    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

