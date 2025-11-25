import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EditableDirective } from '../../../core/directives/editable.directive';
import { CustomizationService } from '../../../core/services/customization.service';
import { CartService } from '../../../core/services/cart.service';
import { CustomerAuthService } from '../../../core/services/customer-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, EditableDirective, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  customData: any = {};
  cartCount = 0;
  isCustomerLoggedIn = false;
  customerName = '';

  constructor(
    private customization: CustomizationService,
    private cartService: CartService,
    private router: Router,
    private customerAuthService: CustomerAuthService
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

    // Watch customer auth state
    this.customerAuthService.currentCustomer$.subscribe(customer => {
      this.isCustomerLoggedIn = customer !== null;
      this.customerName = customer?.name || '';
    });

    // Initial check
    this.isCustomerLoggedIn = this.customerAuthService.isCustomerLoggedIn();
    const customer = this.customerAuthService.getCurrentCustomer();
    if (customer) {
      this.customerName = customer.name;
    }
  }

  goToCart() {
    this.router.navigate(['/demo/restaurant-menu/cart']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.customerAuthService.logout();
    this.router.navigate(['/']);
  }
}
