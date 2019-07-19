import { ajax } from 'rxjs/ajax';
import { NewInvoice, NewInvoiceItems } from '../../store/invoices/types';

export default class InvoicesService {
  static fetchInvoices () {
    return ajax.getJSON('https://api.invoice-app.2muchcoffee.com/api/invoices')
  }

  static deleteInvoice (id: string) {
    return ajax({
      url: `https://api.invoice-app.2muchcoffee.com/api/invoices/${id}`,
      method: 'DELETE'
    })
  }

  static addInvoice (payload: NewInvoice) {
    return ajax({
      url: `https://api.invoice-app.2muchcoffee.com/api/invoices`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    })
  }

  static addInvoiceItem (id: string, payload: NewInvoiceItems) {
    return ajax({
      url: `https://api.invoice-app.2muchcoffee.com/api/invoices/${id}/items`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    })
  }
  // static insertInvoiceItem (id: string, payload: NewInvoiceItems) {
  //   return ajax({
  //     url: `https://api.invoice-app.2muchcoffee.com/api/invoices/${id}/items`,
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: payload
  //   })
  // }
  static getInvoiceItems (id: string) {
    return ajax(`https://api.invoice-app.2muchcoffee.com/api/invoices/${id}/items`)
  }
}