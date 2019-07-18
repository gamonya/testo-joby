export interface Invoices {
  id: string,
  customer_id: string,
  discount?: number,
  total: number,
  items: InvoiceItems[]
}


export interface InvoiceItems {
  id?: string,
  invoice_id: string,
  product_id: string,
  quantity: number
}

export interface InvoiseState {
  currentIdInvoice: string,
  invoices: {
    [id: string]: Invoices
  },
  ids: string[],
  isLoading: boolean,
  error: string | null,
  isInvoiceSaved: boolean,
  currentTotalCount: number
}

// CRUD INTERFACE
export interface NewInvoice {
  customer_id: string,
  discount: number,
  total: number,
}

export interface NewInvoiceItems {
  invoice_id: string,
  product_id: string,
  quantity: number
}