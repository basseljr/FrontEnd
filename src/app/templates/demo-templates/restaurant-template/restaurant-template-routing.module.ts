import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantTemplateComponent } from './restaurant-template.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ItemComponent } from './pages/item/item.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessComponent } from './pages/success/success.component';

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
      { path: 'success', component: SuccessComponent },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantTemplateRoutingModule {}
