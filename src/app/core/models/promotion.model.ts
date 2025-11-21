export interface Promotion {
  id?: number;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
}

