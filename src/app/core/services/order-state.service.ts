import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';

export interface CheckoutInfo {
  name: string;
  email?: string;
  mobile: string;
  mode: 'Pickup' | 'Delivery';
}

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private checkoutInfo?: CheckoutInfo;

  setCheckoutInfo(info: CheckoutInfo) {
    this.checkoutInfo = info;
    localStorage.setItem('checkoutInfo', JSON.stringify(info));
  }

  getCheckoutInfo(): CheckoutInfo | null {
    if (this.checkoutInfo) return this.checkoutInfo;
    const stored = localStorage.getItem('checkoutInfo');
    return stored ? JSON.parse(stored) : null;
  }

  clear() {
    this.checkoutInfo = undefined;
    localStorage.removeItem('checkoutInfo');
  }
}
