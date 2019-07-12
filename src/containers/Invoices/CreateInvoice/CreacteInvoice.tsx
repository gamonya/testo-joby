import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getCustomers } from '../../../store/customers/selectors';
import { getProducts } from '../../../store/products/selectors';
import { genereteNextIdInvoice, getCurrenInvoiceId, getInvoiceById } from '../../../store/invoices/selectors';
import { AppState } from '../../../store';

import './createInvoice.css';
import discountCalculator from '../../../shared/utils/discountCalculator';
import { Dispatch } from 'redux';

import { Actions as ActionsProducts } from '../../../store/products/actions';
import { Actions as ActionsCustomers } from '../../../store/customers/actions';

import CreateForm from './CreateForm/CreateForm';
import { RouteComponentProps } from 'react-router';

interface State {
  price: number,
  discount: number,
  nextId: number,
  url: string
}

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    customers: getCustomers(state),
    products: getProducts(state),
    nextIDs: genereteNextIdInvoice(state),
    currentIdInvoice: getCurrenInvoiceId(state),
    getInvoiceById: getInvoiceById(state),
    formValue: state.form
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProducts: () => dispatch(ActionsProducts.fetchProductsStart()),
  fetchCustomers: () => dispatch(ActionsCustomers.fetchCustomersStart())
});


type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  ;

class CreacteInvoice extends PureComponent<Props, State> {

  public state = {
    price: 1,
    discount: 0,
    nextId: this.props.nextIDs +1,
    url: this.props.match.url
  };

  public componentDidMount(): void {
    this.props.fetchProducts();
    this.props.fetchCustomers();
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    const { values } = this.props.formValue.addInvoice;

    if (prevState.url !== this.props.match.url) {
      this.setState({
        url: this.props.match.url
      })
    }

    if (prevProps.formValue.addInvoice !== this.props.formValue.addInvoice) {

      if(values !== undefined && this.props.products !== undefined && values.product !== undefined && values.qty !== undefined) {
        this.setState({
          price: this.props.products[Number(values.product) - 1].price * Number(values.qty),
        });

        if (values.discount !== undefined) {
          this.setState({
            discount: values.discount
          })
        }
      }
    }
  }

  render() {
    const { customers, products, getInvoiceById } = this.props;
    const endsUrl = this.state.url.endsWith('edit');

    return (
      <div className='create-container'>
        {this.state.url === '/invoices/create/' && <h4 className='viev-title-id'>Invoice #{this.state.nextId}</h4>}
        {endsUrl && <h4 className='viev-title-id'>Invoice #{this.props.currentIdInvoice}</h4>}
        <CreateForm
          customers={customers}
          products={products}
          invoice={getInvoiceById}
          endsUrl={endsUrl}
          nextId={this.state.nextId}
        />
        {/* =================  Total ===========   */}
        <div className='product-total'>
          <div className='total-title'>total</div>
          <div className='total-count'>
            {
              discountCalculator(this.state.price, this.state.discount)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreacteInvoice);