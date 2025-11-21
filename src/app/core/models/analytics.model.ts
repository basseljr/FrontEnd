export interface SalesSummary {
  labels: string[];
  values: number[];
  period: 'daily' | 'weekly' | 'monthly';
}

export interface TopItem {
  itemId: number;
  itemName: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface CustomerAnalytics {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}

export interface AnalyticsData {
  salesSummary: SalesSummary;
  topItems: TopItem[];
  statusBreakdown: OrderStatusBreakdown[];
  customerAnalytics: CustomerAnalytics;
}

