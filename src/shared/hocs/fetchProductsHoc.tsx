import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../../store/products/actions';


function fetchProductsHoc(WrappedComponent: React.ComponentType<any>): React.ComponentType {
  const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchProducts: () => dispatch(Actions.fetchProductsStart())
  });
  type Props =
    & ReturnType<typeof mapDispatchToProps>
    ;

  class FetchProductsHoc extends Component<Props, {}> {
    componentDidMount(): void {
      this.props.fetchProducts();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(null, mapDispatchToProps)(FetchProductsHoc);
}

export default fetchProductsHoc;