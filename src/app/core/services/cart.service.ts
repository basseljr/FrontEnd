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
  private readonly CART_KEY = 'cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.cartItems = this.loadFromStorage();
    this.cartSubject.next(this.cartItems);
  }

  /** Safely load cart from localStorage */
  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn('Failed to load cart from storage', error);
      return [];
    }
  }

  /** Save and notify subscribers */
  private save() {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.warn('Failed to save cart to storage', error);
    }
    this.cartSubject.next([...this.cartItems]); // ensure reactivity
  }

  /** Add item or increase quantity */
  addItem(item: CartItem) {
    const existing = this.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }
    this.save();
  }

  /** Update quantity or remove if zero */
  updateQuantity(itemId: number, quantity: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.save();
      }
    }
  }

  /** Remove item completely */
  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(i => i.id !== itemId);
    this.save();
  }

  /** Clear all items */
  clearCart() {
    this.cartItems = [];
    this.save();
  }

  /** Get total amount */
  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  /** Get current cart snapshot */
  getItems(): CartItem[] {
    return [...this.cartItems];
  }
}
