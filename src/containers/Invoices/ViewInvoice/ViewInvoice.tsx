import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getInvoiceById, getInvoiceItems } from '../../../store/invoices/selectors';
import { getCustomers, getCustomersState } from '../../../store/customers/selectors';
import { getProductState } from '../../../store/products/selectors';
import { AppState } from '../../../store';

import './viewPage.css';
import { Actions } from '../../../store/invoices/actions';
import { Dispatch } from 'redux';
// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoice: getInvoiceById(state),
    items: getInvoiceItems(state),
    customerState: getCustomersState(state),
    customer: getCustomers(state),
    products: getProductState(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoiceItems: (id: string) => dispatch(Actions.fetchInvoiceItems(id))
});

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  ;


class ViewPage extends PureComponent<Props, {}> {

  public componentDidMount(): void {
    if (this.props.invoice) {
      this.props.fetchInvoiceItems(this.props.invoice.id);
    }

  }

  public prodItems = () => {
    const { products, items } = this.props;
    if (items) {
      return items.map((item: any) => {
        return (
          <TableRow key={item.id}>
            <TableCell align="center">
              {products.products[item.product_id].name}
            </TableCell>
            <TableCell align="center">{item.quantity}</TableCell>
            <TableCell align="center">{products.products[item.product_id].price * item.quantity} $</TableCell>
          </TableRow>
          // <tr key={item.id}>
          //   <td className='view-text-content'>{products.products[item.product_id].name}</td>
          //   <td className='view-text-content'>{item.quantity}</td>
          //   <td className='view-text-content'>{products.products[item.product_id].price * item.quantity} $</td>
          // </tr>
        );
      });
    }
  };

  public render() {
    const { invoice, customerState }: any = this.props;
    if (invoice) {
      return (
        <div className='view-container'>
          <div className='view-left'>
            <h4 className='viev-title-id'>Invoice #{invoice.id}</h4>
            <div className='view-text-content'>{customerState.customers[invoice['customer_id']].name}</div>
            <Paper className='view-products'>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Products</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="center">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { this.prodItems() }
                </TableBody>
              </Table>
              <br/>
              <div className='product-total'>
                <div className='total-title'>total</div>
                <div className='total-count'>{invoice.total}</div>
              </div>
            </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);