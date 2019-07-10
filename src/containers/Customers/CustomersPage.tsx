import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import './customer.css';

import { AppState } from '../../store';
import { getCustomers } from '../../store/customers/selectors';
import { Dispatch } from 'redux';
import { Actions } from '../../store/customers/actions';


// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    customers: getCustomers(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCustomers: () => dispatch(Actions.fetchCustomersStart())
});

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  ;

class CustomersPage extends PureComponent<Props, {}> {

  public componentDidMount(): void {
    this.props.fetchCustomers();
  }

  public render() {
    const { customers } = this.props;
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
            <tr key={item.id.toString()}>
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.phone}</td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage);