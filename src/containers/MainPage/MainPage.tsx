import React, { ComponentClass } from 'react';
import { connect } from 'react-redux';

import { compose, Dispatch } from 'redux';

import { Actions } from '../../store/invoices/actions';
import { Actions as ActionsCustomers } from '../../store/customers/actions';
import { Actions as ActionsProducts } from '../../store/products/actions';

import { getInvoices } from '../../store/invoices/selectors';
import { getCustomersState } from '../../store/customers/selectors';
import { AppState } from '../../store';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { getCustomersError, isLoadingCustomer } from '../../store/customers/selectors';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    invoices: getInvoices(state),
    customers: getCustomersState(state),
    // customers
    customersError: getCustomersError(state),
    isLoadingCustomer: isLoadingCustomer(state),
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
    const { invoices, customers, customersError, isLoadingCustomer } = this.props;
    return (
      <>
        {isLoadingCustomer && <h1>Loading ...</h1>}
        {/*  ERROR  CONTENT */}
        {customersError && <h2>{customersError}</h2>}
        {!isLoadingCustomer && <table className='table'>
          <tbody>
          <tr className='table-title'>
            <th>Invoice ID</th>
            <th>Customer Name</th>
            <th>Discount <br/>
              (%)
            </th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
          {invoices.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{customers.customers[item.customer_id].name}</td>
                <td>{item.discount}</td>
                <td>{item.total}</td>
                <td>
                  <button className='invoices-btn invoices-btn--view' onClick={() => this.toView(item.id)}>View</button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>}
      </>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MainPage) as ComponentClass;