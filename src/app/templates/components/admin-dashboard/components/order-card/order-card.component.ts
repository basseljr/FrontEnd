import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../../core/models/order.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css']
})
export class OrderCardComponent {   
  @Input() order!: Order;
  @Output() viewDetails = new EventEmitter<Order>();
  @Output() updateStatus = new EventEmitter<{ order: Order; status: string }>();

  onViewDetails() {
    this.viewDetails.emit(this.order);
  }

  onStatusChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateStatus.emit({ order: this.order, status: select.value });
  }
}

