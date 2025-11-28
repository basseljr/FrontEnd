export interface MenuItem {
  id?: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  stockQuantity?: number;
  discountPercentage?: number;
  finalPrice?: number;
  isTrackStock?: boolean;
}

