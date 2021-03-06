import React, { ComponentClass, PureComponent } from 'react';
import { connect } from 'react-redux';
import { sum } from 'lodash';

import { getCustomers } from '../../../store/customers/selectors';
import { getProducts, getProductState } from '../../../store/products/selectors';
import { getCurrentInvoiceId, getInvoiceById } from '../../../store/invoices/selectors';
import { AppState } from '../../../store';

import './createInvoice.css';
import discountCalculator from '../../../shared/utils/discountCalculator';
import { Dispatch, compose } from 'redux';

import CreateForm from './CreateForm/CreateForm';
import { RouteComponentProps } from 'react-router';
import { Actions } from '../../../store/invoices/actions';

// HOCS
import fetchCustomersHoc from '../../../shared/hocs/fetchCustomersHoc';
import fetchProductsHoc from '../../../shared/hocs/fetchProductsHoc';

interface State {
  price: number,
  totalPrice: number,
  discount: number,
  url: string
}

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    customers: getCustomers(state),
    products: getProducts(state),
    productsState: getProductState(state),
    currentIdInvoice: getCurrentInvoiceId(state),
    getInvoiceById: getInvoiceById(state),
    formValue: state.form
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoiceItems: (id: string) => dispatch(Actions.fetchInvoiceItems(id)),
  setCurrentTotal: (payload: number) => dispatch(Actions.setCurrentTotalCount(payload))
});


type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  ;

class CreacteInvoice extends PureComponent<Props, State> {
  private refTotalCount: React.RefObject<HTMLInputElement> = React.createRef();

  public state = {
    price: 0,
    discount: 0,
    url: this.props.match.url,
    totalPrice: 0
  };

  public componentDidMount(): void {
    if (this.props.getInvoiceById) {
      this.props.fetchInvoiceItems(this.props.getInvoiceById.id);
    }

    if (this.refTotalCount.current) {
      this.props.setCurrentTotal(Number(this.refTotalCount.current.textContent));
    }
  }

  // Return array of price numbers
  public setTotalPrice = () => {
    if (this.props.formValue && this.props.formValue.addInvoice && this.props.formValue.addInvoice.values) {
      const values = this.props.formValue.addInvoice.values;

      if (values.itemsGroup) {
        const res: any = [];
        const keys = Object.keys(values.itemsGroup);

        keys.map((item): void => {
          res.push(this.props.productsState.products[values.itemsGroup[item]].price * values.qtyGroup[item]);
        });
        return res;
      }
    }
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const { values } = this.props.formValue.addInvoice;

    if (prevState.url !== this.props.match.url) {
      this.setState({
        url: this.props.match.url
      });
    }
    // UPDATE TOTAL PRICE
    if (this.refTotalCount.current) {
      this.props.setCurrentTotal(Number(this.refTotalCount.current.textContent));
    }
    //
    if (prevProps.formValue.addInvoice !== this.props.formValue.addInvoice) {
      this.setState({
        totalPrice: sum(this.setTotalPrice())
      });

      if (values !== undefined && this.props.products !== undefined && values.product !== undefined && values.qty !== undefined) {

        this.setState({
          price: this.props.productsState.products[values.product].price * Number(values.qty)
        });

        if (values.discount !== undefined) {
          this.setState({
            discount: values.discount
          });
        }
      }
    }
  }

  render() {
    const { customers, products, getInvoiceById } = this.props;
    const endsUrl = this.state.url.endsWith('edit');
    return (
      <div className='create-container'>
        {!endsUrl && <h4 className='viev-title-id'>New Invoice</h4>}
        {endsUrl && <h4 className='viev-title-id'>Invoice #{this.props.currentIdInvoice}</h4>}
        <CreateForm
          customers={customers}
          products={products}
          invoice={getInvoiceById}
          endsUrl={endsUrl}
          total={this.state.totalPrice}
        />
        {/* =================  Total ===========   */}
        <div className='product-total'>
          <div className='total-title'>total</div>
          {/*  CREATE PAGE */}
          {!endsUrl && <div className='total-count'>
            {
              discountCalculator(this.state.price, this.state.discount)
            }
          </div>}
          {/*  EDIT PAGE */}
          {endsUrl && <div className='total-count' ref={this.refTotalCount}>
            {this.props.getInvoiceById && this.props.getInvoiceById.discount &&
            discountCalculator(this.state.totalPrice, this.props.getInvoiceById.discount) || 0
            }
          </div>}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchCustomersHoc,
  fetchProductsHoc
)(CreacteInvoice) as ComponentClass;