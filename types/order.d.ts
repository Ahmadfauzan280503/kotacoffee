export type TOrderInput = {
  address: string;
  paymentMethod: string;
};

export interface OrderResponse {
  id: string;
  orderId?: string;
  invoiceId?: string;
  paymentUrl?: string;
  payment_method?: string;
  status: string;
  totalPrice?: number;
  total_amount?: number | string;
  shippingFee?: number;
  shipping_fee?: number | string;
  address: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  sellerId?: string;
  userId: string;

  items: OrderItem[];
  seller?: any;
  user?: any;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}
