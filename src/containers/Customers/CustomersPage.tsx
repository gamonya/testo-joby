import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import './customer.css';

import { AppState } from '../../store';
import { getCustomers, getCustomersError } from '../../store/customers/selectors';

import fetchCustomersHoc from '../../shared/hocs/fetchCustomersHoc';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    customers: getCustomers(state),
    error: getCustomersError(state)
  };
};

type Props =
  & ReturnType<typeof mapStateToProps>
  ;

class CustomersPage extends PureComponent<Props, {}> {
  public render() {
    const { customers, error } = this.props;
    if (!error) {
      return (
        <table className='table'>
          <tbody>
          <tr className='table-title'>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Customer Phone number</th>
          </tr>
          {customers.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      );
    } else {
      return (
        <h1>{error}</h1>
      );
    }
  }
}

export default compose(
  connect(mapStateToProps),
  fetchCustomersHoc
)(CustomersPage);