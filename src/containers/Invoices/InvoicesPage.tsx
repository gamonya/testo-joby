import React, { ComponentClass, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './invoices.css';
import { getInvoiceError, getInvoices } from '../../store/invoices/selectors';
import { getCustomersError, getCustomersState, isLoadingCustomer } from '../../store/customers/selectors';
import { AppState } from '../../store';
import { Dispatch, compose } from 'redux';

// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
//

import { Actions } from '../../store/invoices/actions';
// HOCS
import fetchProductsHoc from '../../shared/hocs/fetchProductsHoc';
import fetchCustomersHoc from '../../shared/hocs/fetchCustomersHoc';
import fetchInvoicesHoc from '../../shared/hocs/fetchInvoicesHoc';


// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoices: getInvoices(state),
    customer: getCustomersState(state),
    invoiceError: getInvoiceError(state),
    // customers
    customersError: getCustomersError(state),
    isLoadingCustomer: isLoadingCustomer(state)
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInvoiceId: (id: string) => dispatch(Actions.setCurrentIdInvoice(id)),
  startDeleteInvoice: (id: string) => dispatch(Actions.startDeleteInvoice(id)),

  setCurrentEditedItem: (id: string, product: string, quantity: number) => dispatch(Actions.setCurrentEditedItem(id, product, quantity))
});

type Props =
  & ReturnType<typeof mapStateToProps>
  & RouteComponentProps
  & ReturnType<typeof mapDispatchToProps>
  ;

function InvoicesPage(props: Props) {
  const { invoices, customer, isLoadingCustomer, customersError, invoiceError } = props;

  useEffect(() => {
    props.setCurrentEditedItem('', '', 0);
  }, []);

  const toView = (id: string) => {
    props.setInvoiceId(id);
    props.history.push(`/invoice/${id}/view/`);
  };

  const toEdit = (id: string) => {
    props.setInvoiceId(id);
    props.history.push(`/invoice/${id}/edit`);
  };

  const removeInvoice = (id: string) => {
    if (window.confirm('Are you sure you want to delete an invoice?')) {
      props.startDeleteInvoice(id);
    }

  };

  return (
    <div className='invoices'>
      {isLoadingCustomer && <h1>Loading ...</h1>}
      {/*  ERROR  CONTENT */}
      {customersError && <h2>{customersError}</h2>}
      {invoiceError && <h2>{invoiceError}</h2>}
      <Paper className='table'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell align="right">Customer Name</TableCell>
              <TableCell align="right">Discount (%)</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoadingCustomer && invoices.map(item => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>
                <TableCell align="right">{customer.customers[item.customer_id].name}</TableCell>
                <TableCell align="right">{item.discount}</TableCell>
                <TableCell align="right">{item.total}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" color="primary" onClick={() => toView(item.id)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => toEdit(item.id)}><Icon>edit</Icon></Button>
                  <Button size="small" onClick={() => removeInvoice(item.id)}><Icon color="error">delete</Icon></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  fetchProductsHoc,
  fetchCustomersHoc,
  fetchInvoicesHoc
)(InvoicesPage) as ComponentClass;
