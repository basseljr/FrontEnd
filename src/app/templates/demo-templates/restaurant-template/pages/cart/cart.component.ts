import { Component } from '@angular/core';
import { CartSharedComponent } from "../../../../components/cart-shared/cart-shared.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartSharedComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

}
