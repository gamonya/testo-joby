import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

// UI
import './customer.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//
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

function CustomersPage(props: Props) {
  const { customers, error } = props;
  if (!error) {
    return (
      <Paper className='table'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell align="right">Customer Address</TableCell>
              <TableCell align="right">Customer Phone number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(item => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.address}</TableCell>
                <TableCell align="right">{item.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  } else {
    return (
      <h1>{error}</h1>
    );
  }
}

export default compose(
  connect(mapStateToProps),
  fetchCustomersHoc
)(CustomersPage);