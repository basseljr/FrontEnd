import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditableDirective } from '../../../../../core/directives/editable.directive';
import { CustomizationService } from '../../../../../core/services/customization.service';
import { OrderService } from '../../../../../core/services/order.service';
import { CartService } from '../../../../../core/services/cart.service';
import { OrderStateService } from '../../../../../core/services/order-state.service';
type PaymentMethod = 'cash' | 'knet' | 'visa';

interface PaymentCustomData {
  pageTitle: string;
  subtitle: string;
  cashLabel: string;
  knetLabel: string;
  visaLabel: string;
  orderItemsTitle: string;
  pickupInfoTitle: string;
  pickupTimeLabel: string;
  pickupTimeValue: string;
  pickupLocationLabel: string;
  pickupLocationValue: string;
  contactNameLabel: string;
  contactNameValue: string;
  contactMobileLabel: string;
  contactMobileValue: string;
  contactEmailLabel: string;
  contactEmailValue: string;
  subtotalLabel: string;
  totalLabel: string;
  payNowLabel: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, OnDestroy {
  customData: PaymentCustomData = this.getDefaultPaymentData();
  selectedPayment: PaymentMethod | null = 'cash';
  subscription?: Subscription;

  paymentMethods: Array<{ key: PaymentMethod; icon: string; labelKey: keyof PaymentCustomData }> =
    [
      { key: 'cash', icon: 'bi-cash', labelKey: 'cashLabel' },
      { key: 'knet', icon: 'bi-bank', labelKey: 'knetLabel' },
      { key: 'visa', icon: 'bi-credit-card', labelKey: 'visaLabel' }
    ];

    orderItems: any[] = [];


  constructor(
    private customization: CustomizationService,
    private router: Router,
    private route: ActivatedRoute,
    private orderState: OrderStateService,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.subscription = this.customization.currentData.subscribe(data => {
      const paymentData = data.payment || {};
      this.customData = { ...this.getDefaultPaymentData(), ...paymentData };
    });
  
    this.orderItems = this.cartService.getItems();

    const checkoutInfo = this.orderState.getCheckoutInfo();
    if (checkoutInfo) {
      this.customData.contactNameValue = checkoutInfo.name;
      this.customData.contactMobileValue = checkoutInfo.mobile;
      this.customData.contactEmailValue = checkoutInfo.email || '';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  selectPayment(method: PaymentMethod) {
    this.selectedPayment = method;
  }

  goBack() {
    this.router.navigate(['/checkout']);
  }

  goToSuccess() {
    const checkoutInfo = this.orderState.getCheckoutInfo();
    const items = this.cartService.getItems();
  
    if (!checkoutInfo || items.length === 0) {
      alert('Missing checkout information or cart items');
      return;
    }
  
    const order = {
      customerName: checkoutInfo.name,
      email: checkoutInfo.email,
      mobile: checkoutInfo.mobile,
      mode: checkoutInfo.mode,
      total: this.total,
      items: items
    };
    
    
    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        console.log('Order saved!', res);
        this.cartService.clearCart();
        this.orderState.clear();
    
        this.router.navigate(['../success', res.orderId], { relativeTo: this.route });
      },
      error: (err) => console.error('Failed to save order', err)
    });
  }
  
  

  get subtotal() {
    return this.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get total() {
    return this.subtotal;
  }

  private getDefaultPaymentData(): PaymentCustomData {
    return {
      pageTitle: 'Payment Method',
      subtitle: 'Choose your preferred payment method',
      cashLabel: 'Cash',
      knetLabel: 'K-Net',
      visaLabel: 'Visa / Master (Credit)',
      orderItemsTitle: 'Order Items',
      pickupInfoTitle: 'Pickup Information',
      pickupTimeLabel: 'Pickup Time',
      pickupTimeValue: 'As Soon As Possible',
      pickupLocationLabel: 'Pickup Location',
      pickupLocationValue: 'Salmiya',
      contactNameLabel: 'Name',
      contactNameValue: 'Mohammad Ali',
      contactMobileLabel: 'Mobile',
      contactMobileValue: '+965 5000 1234',
      contactEmailLabel: 'Email',
      contactEmailValue: 'customer@email.com',
      subtotalLabel: 'Subtotal',
      totalLabel: 'Total',
      payNowLabel: 'Pay Now'
    };
  }
}

