import { ajax } from 'rxjs/ajax';
export default class CustomersService {
  static getCustomers() {
    return ajax.getJSON('https://api.invoice-app.2muchcoffee.com/api/customers')
  }
}