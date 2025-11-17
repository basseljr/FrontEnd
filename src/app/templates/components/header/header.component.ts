import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  customData: any = {};
  cartCount = 0;

  constructor(
    private customization: CustomizationService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Watch header customization
    this.customization.currentData.subscribe(data => {
      this.customData = data.header;
    });

    // Watch cart changes
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
    });
  }

  goToCart() {
    this.router.navigate(['/demo/restaurant-menu/cart']);
  }
}
