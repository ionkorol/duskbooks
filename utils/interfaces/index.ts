import firebaseAdmin from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";

export interface CartProp {
  items: CartItemProp[];
}

export interface CartItemProp {
  quantity: number;
  ref: firebaseAdmin.firestore.DocumentReference;
}

export interface BookDataProp {
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
  lineItems: { quantity: number; data: BookDataProp }[];
  shippingPrice: number;
  totalPrice: number;
  userId: string;
  createdAt: { _seconds: number; _nanoseconds: number };
  fulfillmentStatus: "Processing" | "Shipped" | "Completed" | "Canceled";
  shippingAddress: AddressProp;
  billingAddress: AddressProp;
  paymentMethod: "Paypal" | "Card";
  itemsTotalPrice: number;
}

export interface OrderInProp {
  id: number;
  lineItems: { quantity: number; data: BookDataProp }[];
  totalPrice: number;
  userId: string;
  createdAt: firebaseClient.firestore.FieldValue;
  fulfillmentStatus: "Processing" | "Shipped" | "Completed" | "Canceled";
  shippingAddress: AddressProp;
  billingAddress: AddressProp;
  paymentMethod: "Paypal" | "Card";
  shippingPrice: number;
  itemsTotalPrice: number;
}

export interface UserWithOrdersProp {
  firstName: string;
  lastName: string;
  email: string;
  orders: OrderProp[];
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

export interface FirebaseUserProp {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserProp {
  credentials: firebaseClient.User;
  data: FirebaseUserProp;
}
