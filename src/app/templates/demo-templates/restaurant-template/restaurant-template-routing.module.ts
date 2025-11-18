import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantTemplateComponent } from './restaurant-template.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ItemComponent } from './pages/item/item.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessComponent } from './pages/success/success.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OrderHistoryComponent } from '../../components/order-history/order-history.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantTemplateComponent,
    children: [
      { path: '', component: HomeComponent },                // /demo/:templateName
      { path: 'category/:id', component: CategoryComponent }, // /demo/:templateName/category/:id
      { path: 'item/:id', component: ItemComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'success', component: SuccessComponent },
      { path: 'success/:id', component: SuccessComponent },
      { path: 'order-history', component: OrderHistoryComponent },


    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTemplateRoutingModule {}
