export interface Invoices {
  id: number,
  customer_id: number,
  discount: number,
  total: number,
  items: InvoiceItems[]
}

export interface InvoiceItems {
  id: number,
  invoice_id: number,
  product_id: number,
  quantity: number
}

export interface InvoiseState {
  currentIdInvoice: number,
  invoices: {
    [id: number]: Invoices
  },
  ids: number[],
  isLoading: boolean,
  error: string | null,
  isInvoiceSaved: boolean,
  currentTotalCount: number
}