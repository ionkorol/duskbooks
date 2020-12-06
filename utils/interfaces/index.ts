export interface CartProp {
  items: ItemProp[];
}

export interface ItemProp {
  quantity: number;
  data: ItemDataProp;
}

export interface ItemDataProp {
  name: string;
  isbn: string;
}


export interface BookDataProp {
  isbn10: string;
  ean: string;
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
  price: number;
  salePrice: number;
  stock: number;
}