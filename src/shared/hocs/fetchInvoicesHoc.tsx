import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../../store/invoices/actions';


function fetchInvoicesHoc(WrappedComponent: React.ComponentType<any>): React.ComponentType {
  const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchInvoices: () => dispatch(Actions.fetchInvoicesStart())
  });
  type Props =
    & ReturnType<typeof mapDispatchToProps>
    ;

  class FetchInvoicesHoc extends Component<Props, {}> {

    componentDidMount(): void {
      this.props.fetchInvoices();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(null, mapDispatchToProps)(FetchInvoicesHoc);
}

export default fetchInvoicesHoc;