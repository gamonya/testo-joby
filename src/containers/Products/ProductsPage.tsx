import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import './products.css';
import { AppState } from '../../store';
import { getProducts, getErrorProducts } from '../../store/products/selectors';

// UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//
import fetchProductsHoc from '../../shared/hocs/fetchProductsHoc';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    products: getProducts(state),
    error: getErrorProducts(state)
  };
};


type Props =
  & ReturnType<typeof mapStateToProps>
  ;

class ProductsPage extends Component<Props, {}> {
  public render() {
    const { products, error } = this.props;
    if (!error) {
      return (
        <Paper className='table'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(item => (
                <TableRow key={item.id}>
                  <TableCell align="center">
                    {item.name}
                  </TableCell>
                  <TableCell align="center">{item.price}</TableCell>
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
}

export default compose(
  connect(mapStateToProps),
  fetchProductsHoc
)(ProductsPage);