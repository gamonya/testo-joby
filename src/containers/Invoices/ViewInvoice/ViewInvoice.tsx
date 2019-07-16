import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import discountCalculator from '../../../shared/utils/discountCalculator';
import { getInvoiceById } from '../../../store/invoices/selectors';
import { getCustomers } from '../../../store/customers/selectors';
import { getProductState } from '../../../store/products/selectors';
import { AppState } from '../../../store';

import './viewPage.css';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoice: getInvoiceById(state),
    customer: getCustomers(state),
    products: getProductState(state)
  };
};

type Props =
  & ReturnType<typeof mapStateToProps>
  ;


class ViewPage extends PureComponent<Props, {}> {
  public total = () => {
    let i = [];
    for(let item of this.props.invoice.items) {
      i.push(this.props.products.products[item.product_id].price * item.quantity)
    }
    const res = i.reduce((a, b) => a + b);
   return discountCalculator(res, this.props.invoice.discount)
  };

  public prodItems = () => {
    const { products } = this.props;
   return this.props.invoice.items.map(item => {
      return (
        <tr key={item.id}>
          <td className='view-text-content'>{products.products[item.product_id].name}</td>
          <td className='view-text-content'>{item.quantity}</td>
          <td className='view-text-content'>{products.products[item.product_id].price * item.quantity} $</td>
        </tr>
      );
    })
  };

  public render() {
    const { invoice, customer } = this.props;
    if (invoice) {
      return (
        <div className='view-container'>
            <div className='view-left'>
              <h4 className='viev-title-id'>Invoice #{invoice.id}</h4>
              <div className='view-text-content'>{customer[invoice.customer_id - 1].name}</div>
              <div className='view-products'>
                <table className='view-table'>
                  <tbody>
                  <tr>
                    <th className='view-table--title'>Products</th>
                    <th className='view-table--title'>Qty</th>
                    <th className='view-table--title'>Price</th>
                  </tr>
                  {this.prodItems()}
                  </tbody>
                </table>
                <hr/>
                <div className='product-total'>
                  <div className='total-title'>total</div>
                  <div className='total-count'>${this.total()}</div>
                </div>
              </div>
            </div>
            <div className='view-right'>
              <div className='viev-discount-title'>Discount %</div>
              <div className='view-discount-number'>{invoice.discount}</div>
            </div>
        </div>
      );
    } else {
      return <h1>no id invoice</h1>;
    }
  }

}

export default connect(mapStateToProps)(ViewPage);