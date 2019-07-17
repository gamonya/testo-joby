export interface Products {
  id: string;
  name: string;
  price: number;
}

export interface ProductsState {
  products: {
    [id: string]: Products
  },
  error: string | null,
  ids: string[],
  isLoading: boolean
}