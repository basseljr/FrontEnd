export interface BusinessHours {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface PaymentOption {
  type: 'Cash' | 'KNET' | 'Visa';
  enabled: boolean;
}

export interface RestaurantSettings {
  id?: number;
  restaurantName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  taxRate: number;
  deliveryFee: number;
  businessHours: BusinessHours[];
  paymentOptions: PaymentOption[];
}

