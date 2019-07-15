import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './invoices.css';
import { getInvoices } from '../../store/invoices/selectors';
import { getCustomersError, getCustomersState, isLoadingCustomer } from '../../store/customers/selectors';
import { AppState } from '../../store';
import { Dispatch, compose } from 'redux';

import { Actions } from '../../store/invoices/actions';
import { Actions as ActionsCustomers } from '../../store/customers/actions';
import { Actions as ActionsProducts } from '../../store/products/actions';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoices: getInvoices(state),
    customer: getCustomersState(state),
    // customers
    customersError: getCustomersError(state),
    isLoadingCustomer: isLoadingCustomer(state)
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInvoiceId: (id: number) => dispatch(Actions.setCurrentIdInvoice(id)),
  fetchInvoices: () => dispatch(Actions.fetchInvoicesStart()),
  fetchCustomers: () => dispatch(ActionsCustomers.fetchCustomersStart()),
  fetchProducts: () => dispatch(ActionsProducts.fetchProductsStart()),
  removeInvoice: (id: number) => dispatch(Actions.removeInvoice(id))
});

type Props =
  & ReturnType<typeof mapStateToProps>
  & RouteComponentProps
  & ReturnType<typeof mapDispatchToProps>
  ;


class InvoicesPage extends PureComponent<Props, {}> {

  public componentDidMount(): void {
    this.props.fetchInvoices();
    this.props.fetchCustomers();
    this.props.fetchProducts();
  }

  toView = (id: number) => {
    this.props.setInvoiceId(id);
    this.props.history.push(`/invoice/${id}/view/`);
  };

  toEdit = (id: number) => {
    this.props.setInvoiceId(id);
    this.props.history.push(`/invoice/${id}/edit`);
  };

  removeInvoice = (id: number) => {
    this.props.removeInvoice(id);
  };

  public render() {
    const { invoices, customer, isLoadingCustomer, customersError } = this.props;
    return (
      <div className='invoices'>
        {isLoadingCustomer && <h1>Loading ...</h1>}
        {/*  ERROR  CONTENT */}
        {customersError && <h2>{customersError}</h2>}

        <table className='table'>
          <tbody>
          <tr className='table-title'>
            <th>Invoice ID</th>
            <th>Customer Name</th>
            <th>Discount %</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
          {!isLoadingCustomer && invoices.map((item) => {
            return (
              <tr key={item.id.toString()}>
                <td>{item.id}</td>
                <td>{customer.customers[item.customer_id].name}</td>
                <td>{item.discount}</td>
                <td>{item.total}</td>
                <td>
                  <button className='invoices-btn invoices-btn--view' onClick={() => this.toView(item.id)}>View</button>
                  <button className='invoices-btn invoices-btn--edit' onClick={() => this.toEdit(item.id)}>Edit</button>
                  <button
                    onClick={() => this.removeInvoice(item.id)}
                    className='invoices-btn invoices-btn--delete'
                  >Delete</button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(InvoicesPage) as any;
