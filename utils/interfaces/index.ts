export interface UserProp {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  orders?: OrderProp[];
  cart?: CartItemProp[];
}

export interface CartItemProp {
  quantity: number;
  id?: string;
  data?: ProductProp;
}

export interface ProductProp {
  isbn10: string;
  isbn13: string;
  title: string;
  description: string;
  contributor1: string;
  language: string;
  pages: number;
  pubDate: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  regPrice: number;
  salePrice: number;
  stock: number;
}

export interface OrderProp {
  id: number;
  lineItems: { quantity: number; data: ProductProp }[];
  shippingPrice: number;
  totalPrice: number;
  createdAt: number;
  fulfillmentStatus: "Processing" | "Shipped" | "Completed" | "Canceled";
  shippingAddress: AddressProp;
  billingAddress: AddressProp;
  paymentMethod: "Paypal" | "Stripe";
  itemsTotalPrice: number;
}

export interface AddressProp {
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}
