import { ajax } from 'rxjs/ajax';

export default class ProductsService {
  static getProducts() {
    return ajax.getJSON('https://api.invoice-app.2muchcoffee.com/api/products')
  }
}