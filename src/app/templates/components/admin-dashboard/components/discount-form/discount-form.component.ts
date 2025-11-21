import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Promotion } from '../../../../../core/models/promotion.model';

@Component({
  selector: 'app-discount-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.css']
})
export class DiscountFormComponent implements OnInit {
  @Input() promotion: Promotion | null = null;
  @Input() isOpen: boolean = false;
  @Output() save = new EventEmitter<Promotion>();
  @Output() close = new EventEmitter<void>();

  formData: Promotion = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date().toISOString().split('T')[0],
    isActive: true,
    usageLimit: 0
  };

  ngOnInit() {
    if (this.promotion) {
      this.formData = { ...this.promotion };
    }
  }

  onSubmit() {
    if (this.formData.code && this.formData.discountValue > 0) {
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
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date().toISOString().split('T')[0],
      isActive: true,
      usageLimit: 0
    };
  }
}

