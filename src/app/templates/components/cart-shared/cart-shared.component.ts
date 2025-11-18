import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-cart-shared',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule],  
  templateUrl: './cart-shared.component.html',
  styleUrl: './cart-shared.component.css'
})
export class CartSharedComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(data => {
      this.items = data;
      this.total = this.cartService.getTotal();
    });
  }

  increase(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  remove(itemId: number) {
    this.cartService.removeItem(itemId);
  }

  clear() {
    this.cartService.clearCart();
  }
}
