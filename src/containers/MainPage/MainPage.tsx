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

import { getInvoiceError, getInvoices } from '../../store/invoices/selectors';
import { getCustomersState } from '../../store/customers/selectors';
import { AppState } from '../../store';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getCustomersError, isLoadingCustomer } from '../../store/customers/selectors';
// HOCS
import fetchInvoicesHoc from '../../shared/hocs/fetchInvoicesHoc';
import fetchProductsHoc from '../../shared/hocs/fetchProductsHoc';
import fetchCustomersHoc from '../../shared/hocs/fetchCustomersHoc';

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
  setInvoiceId: (id: string) => dispatch(Actions.setCurrentIdInvoice(id))
});


type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  ;


function MainPage(props: Props) {
  const { invoices, customers, customersError, isLoadingCustomer, invoiceError } = props;

  const toView = (id: string) => {
    props.history.push(`/invoice/${id}/view/`);
    props.setInvoiceId(id);
  };

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
                  <Button variant="outlined" size="small" color="primary" onClick={() => toView(item.id)}>
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

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  fetchCustomersHoc,
  fetchProductsHoc,
  fetchInvoicesHoc
)(MainPage) as ComponentClass;