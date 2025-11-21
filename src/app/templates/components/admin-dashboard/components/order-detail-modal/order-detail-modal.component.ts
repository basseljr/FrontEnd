import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../../core/models/order.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.css']
})
export class OrderDetailModalComponent {
  @Input() order: Order | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}

