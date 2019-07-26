import React, { ComponentClass } from 'react';
import { connect } from 'react-redux';

import { compose, Dispatch } from 'redux';
// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
//
import { Actions } from '../../store/invoices/actions';
import { Actions as ActionsCustomers } from '../../store/customers/actions';
import { Actions as ActionsProducts } from '../../store/products/actions';

import { getInvoiceError, getInvoices } from '../../store/invoices/selectors';
import { getCustomersState } from '../../store/customers/selectors';
import { AppState } from '../../store';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getCustomersError, isLoadingCustomer } from '../../store/customers/selectors';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoices: getInvoices(state),
    customers: getCustomersState(state),
    invoiceError: getInvoiceError(state),
    // customers
    customersError: getCustomersError(state),
    isLoadingCustomer: isLoadingCustomer(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInvoiceId: (id: string) => dispatch(Actions.setCurrentIdInvoice(id)),
  fetchInvoices: () => dispatch(Actions.fetchInvoicesStart()),
  fetchCustomers: () => dispatch(ActionsCustomers.fetchCustomersStart()),
  fetchProducts: () => dispatch(ActionsProducts.fetchProductsStart())
});


type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  ;


class MainPage extends React.PureComponent<Props, {}> {

  public componentDidMount(): void {
    this.props.fetchInvoices();
    this.props.fetchCustomers();
    this.props.fetchProducts();
  }

  // Вынести в компонент кнопку
  toView = (id: string) => {
    this.props.history.push(`/invoice/${id}/view/`);
    this.props.setInvoiceId(id);
  };

  public render() {
    const { invoices, customers, customersError, isLoadingCustomer, invoiceError } = this.props;
    return (
      <>
        {isLoadingCustomer && <h1>Loading ...</h1>}
        {/*  ERROR  CONTENT */}
        {customersError && <h2>{customersError}</h2>}
        {invoiceError && <h2>{invoiceError}</h2>}
        {!isLoadingCustomer &&
        <Paper className='table'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell align="right">Customer Name</TableCell>
                <TableCell align="right">Discount (%)</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map(item => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="right">{customers.customers[item.customer_id].name}</TableCell>
                  <TableCell align="right">{item.discount}</TableCell>
                  <TableCell align="right">{item.total}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" size="small" color="primary" onClick={() => this.toView(item.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        }
      </>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MainPage) as ComponentClass;