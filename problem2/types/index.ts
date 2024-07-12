// types.ts

export interface Product {
  productName: string;
  price: number;
  rating: number;
  discount: number;
  availability: string; // Assuming availability is a string like "yes" or "out-of-stock"
}
