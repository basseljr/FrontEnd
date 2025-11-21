import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../../core/models/category.model';

@Component({
  selector: 'app-add-edit-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-category-form.component.html',
  styleUrls: ['./add-edit-category-form.component.css']
})
export class AddEditCategoryFormComponent implements OnInit, OnChanges {
  @Input() category: Category | null = null;
  @Input() isOpen: boolean = false;
  @Output() save = new EventEmitter<Category>();
  @Output() close = new EventEmitter<void>();

  formData: Category = {
    id: 0,
    name: '',
    imageUrl: '',
    displayOrder: 0
  };

  ngOnInit() {
    this.updateFormData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && this.isOpen) {
      this.updateFormData();
    }
    if (changes['isOpen'] && this.isOpen && this.category) {
      this.updateFormData();
    }
  }

  private updateFormData() {
    if (this.category) {
      this.formData = { ...this.category };
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.formData.name) {
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
      id: 0,
      name: '',
      imageUrl: '',
      displayOrder: 0
    };
  }
}