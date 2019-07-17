import { ajax } from 'rxjs/ajax';
export default class InvoicesService {
  static fetchInvoices () {
    return ajax.getJSON('https://api.invoice-app.2muchcoffee.com/api/invoices')
  }
}