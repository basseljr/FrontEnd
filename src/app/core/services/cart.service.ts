import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cartItems = JSON.parse(stored);
      this.cartSubject.next(this.cartItems);
    }
  }

  private save() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addItem(item: CartItem) {
    const existing = this.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.save();
  }

  updateQuantity(itemId: number, quantity: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.removeItem(itemId);
      else this.save();
    }
  }

  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(i => i.id !== itemId);
    this.save();
  }

  clearCart() {
    this.cartItems = [];
    this.save();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
