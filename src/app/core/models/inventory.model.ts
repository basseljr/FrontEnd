export interface InventoryItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  stockQuantity: number;
  isAvailable: boolean;
  isTrackStock: boolean;
  imageUrl?: string;
}

