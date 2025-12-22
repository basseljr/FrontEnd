import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { EditableDirective } from '../../../../../core/directives/editable.directive';
import { CustomizationService } from '../../../../../core/services/customization.service';
import { OrderStateService } from '../../../../../core/services/order-state.service';
import { TemplateContextService } from '../../../../../core/services/template-context.service';

type CheckoutMode = 'pickup' | 'delivery';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, EditableDirective,],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  customData = this.getDefaultCheckoutData();
  activeMode: CheckoutMode = 'pickup';
  form = {
    name: '',
    countryCode: '+965',
    mobileNumber: '',
    email: '',
    createAccount: false
  };

  private subscription?: Subscription;

  constructor(
    private customization: CustomizationService,
    private router: Router,
    private route: ActivatedRoute,
    private orderState: OrderStateService,
    private templateContext: TemplateContextService
  ) {}

  ngOnInit() {
    this.subscription = this.customization.currentData.subscribe(data => {
      const checkoutData = data.checkout || {};
      this.customData = { ...this.getDefaultCheckoutData(), ...checkoutData };
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  setMode(mode: CheckoutMode) {
    this.activeMode = mode;
  }
  goToPayment() {
    // Save checkout form and mode before navigating
    this.orderState.setCheckoutInfo({
      name: this.form.name || 'Guest',
      email: this.form.email,
      mobile: this.form.countryCode + ' ' + this.form.mobileNumber,
      mode: this.activeMode === 'pickup' ? 'Pickup' : 'Delivery'
    });
  
    const queryParams = this.templateContext.getPreservedQueryParams();
    this.router.navigate(['../payment'], { 
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
  

  private getDefaultCheckoutData() {
    return {
      pickupTabLabel: 'Pickup',
      deliveryTabLabel: 'Delivery',
      pickupFromLabel: 'Pickup From',
      pickupFrom: 'Salmiya',
      pickupTimeLabel: 'Pickup Time',
      pickupTime: 'As Soon As Possible',
      deliveryPlaceholderTitle: 'Delivery Address',
      deliveryPlaceholderBody:
        'Add your delivery details and instructions here.',
      contactTitle: 'My Contact Information',
      labelName: 'Name',
      labelMobile: 'Mobile Number',
      labelEmail: 'Email (Optional)',
      createAccountLabel: 'Create Account',
      loginText: 'Already have an account? Login',
      nextButtonLabel: 'Next'
    };
  }
}
