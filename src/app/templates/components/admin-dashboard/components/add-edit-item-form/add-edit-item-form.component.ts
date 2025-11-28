import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../../../../core/models/menu-item.model';
import { Category } from '../../../../../core/models/category.model';

@Component({
  selector: 'app-add-edit-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-item-form.component.html',
  styleUrls: ['./add-edit-item-form.component.css']
})
export class AddEditItemFormComponent implements OnInit, OnChanges {
  @Input() item: MenuItem | null = null;
  @Input() categories: Category[] = [];
  @Input() isOpen: boolean = false;
  @Output() save = new EventEmitter<MenuItem>();
  @Output() close = new EventEmitter<void>();

  formData: MenuItem = {
    categoryId: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isAvailable: true,
    stockQuantity: 0,
    discountPercentage: 0,
    isTrackStock: false
  };

  get finalPrice(): number {
    if (!this.formData.price || !this.formData.discountPercentage) {
      return this.formData.price || 0;
    }
    return this.formData.price - (this.formData.price * (this.formData.discountPercentage / 100));
  }

  ngOnInit() {
    this.updateFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.isOpen) {
      this.updateFormData();
    }
    if (changes['isOpen'] && this.isOpen && this.item) {
      this.updateFormData();
    }
  }

  private updateFormData() {
    if (this.item) {
      this.formData = { ...this.item };
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.formData.name && this.formData.price > 0 && this.formData.categoryId > 0) {
      // If stockQuantity is 0 and isTrackStock is true, automatically set isAvailable to false
      if (this.formData.isTrackStock === true && this.formData.stockQuantity === 0) {
        this.formData.isAvailable = false;
      }
      this.save.emit(this.formData);
      this.resetForm();
    }
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  private resetForm() {
    this.formData = {
      categoryId: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isAvailable: true,
      stockQuantity: 0,
      discountPercentage: 0,
      isTrackStock: false
    };
  }
}