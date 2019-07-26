import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../../store/customers/actions';


function fetchCustomersHoc(WrappedComponent: React.ComponentType<any>): React.ComponentType {
  const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchCustomers: () => dispatch(Actions.fetchCustomersStart())
  });
  type Props =
    & ReturnType<typeof mapDispatchToProps>
    ;

  class FetchCustomersHoc extends Component<Props, {}> {

    componentDidMount(): void {
      this.props.fetchCustomers();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(null, mapDispatchToProps)(FetchCustomersHoc);
}

export default fetchCustomersHoc;