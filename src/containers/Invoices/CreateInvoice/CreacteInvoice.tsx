import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getCustomers } from '../../../store/customers/selectors';
import { getProducts, getProductState } from '../../../store/products/selectors';
import { genereteNextIdInvoice, getCurrenInvoiceId, getInvoiceById, getTotalCount } from '../../../store/invoices/selectors';
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
  totalPrice: number,
  discount: number,
  nextId: number,
  url: string
}

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    customers: getCustomers(state),
    products: getProducts(state),
    productsState: getProductState(state),
    nextIDs: genereteNextIdInvoice(state),
    currentIdInvoice: getCurrenInvoiceId(state),
    getInvoiceById: getInvoiceById(state),
    totalCount: getTotalCount(state),
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
    price: 0,
    discount: 0,
    nextId: this.props.nextIDs,
    url: this.props.match.url,
    totalPrice: 0
  };

  public componentDidMount(): void {
    this.props.fetchProducts();
    this.props.fetchCustomers();
    this.setTotalPrice()
  }

  public setTotalPrice = () => {
    if (this.props.totalCount) {
      const result: any = [];

      this.props.totalCount.map(item => {
        for(let val in item) {
        result.push(this.props.productsState.products[Number(val)].price * Number(item[val]))
        }
      });
      const total = result.reduce((a: number,b: number) => a + b);
      this.setState({
        totalPrice: total
      });
    }
  };

  public componentDidUpdate(prevProps: any, prevState: any) {
    const { values } = this.props.formValue.addInvoice;
    if (prevState.url !== this.props.match.url) {
      this.setState({
        url: this.props.match.url
      })
    }

    if(prevProps.getInvoiceById !== this.props.getInvoiceById ) {
      this.setTotalPrice();
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
          total={this.state.totalPrice}
          nextId={this.state.nextId}
        />
        {/* =================  Total ===========   */}
        <div className='product-total'>
          <div className='total-title'>total</div>
          {/*  CREATE PAGE */}
         {this.state.url === '/invoices/create/' && <div className='total-count'>
            {
              discountCalculator(this.state.price, this.state.discount)
            }
          </div>}
          {/*  EDIT PAGE */}
          {endsUrl && <div className='total-count'>
            {this.props.getInvoiceById &&
              discountCalculator(this.state.totalPrice, this.props.getInvoiceById.discount)
            }
          </div>}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreacteInvoice);