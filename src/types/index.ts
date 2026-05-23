export interface Product {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  stripeCustomerId?: string | null;
  subscriptionStatus: string;
  subscriptionId?: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  shippingFee: number;
  status: string;
  createdAt: Date;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type SubscriptionStatus = "active" | "inactive" | "cancelled" | "past_due";
