export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "tees" | "journals";
  image: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
  customerEmail: string;
  customerName: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  createdAt: Date;
}
