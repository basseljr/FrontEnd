export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  Ready = 'Ready',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface OrderItem {
  id?: number;
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  email?: string;
  mobile: string;
  mode: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

