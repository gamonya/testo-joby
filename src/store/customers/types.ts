export interface Customers {
    id: string,
    name: string,
    address: string,
    phone: string,
}

export interface CustomersState {
   customers: {
     [id: string]: Customers
   },
  ids: string[],
  error: string | null,
  isLoading: boolean
}