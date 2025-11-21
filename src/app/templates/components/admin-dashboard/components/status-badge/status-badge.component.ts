    import { Component, Input } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { OrderStatus } from '../../../../../core/models/order.model';

    @Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
        <span class="badge" [ngClass]="getStatusClass()">{{ status }}</span>
    `
    })
    export class StatusBadgeComponent {
    @Input() status: OrderStatus | string = '';

    getStatusClass(): string {
        const statusMap: { [key: string]: string } = {
        'Pending': 'bg-warning text-dark',
        'Preparing': 'bg-info text-white',
        'Ready': 'bg-primary text-white',
        'Delivered': 'bg-success text-white',
        'Cancelled': 'bg-danger text-white'
        };
        return statusMap[this.status] || 'bg-secondary text-white';
    }
    }

