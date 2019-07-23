import React, { useState, useEffect, useRef, useCallback } from 'react';
import myValidator from './validate';
import { Field, reduxForm, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, Redirect } from 'react-router-dom';

import ErrorBoundary from '../../../../shared/components/ErrorBoundary/ErrorBoundary'

import { Products } from '../../../../store/products/types';
import { Customers } from '../../../../store/customers/types';
import { Dispatch } from 'redux';
import { Invoices } from '../../../../store/invoices/types';
import { Actions } from '../../../../store/invoices/actions';
import {
  getEditedQtyState,
  getEditedProductsState,
  getEditedCustomerState,
  getInvoiceState,
  getInvoiceItems
} from '../../../../store/invoices/selectors';
import { AppState } from '../../../../store';
import { getProductState } from '../../../../store/products/selectors';
import { customSelect, customInputNumber } from './customFields';

interface PropsOwn {
  products: Products[],
  customers: Customers[],
  invoice: Invoices,
  endsUrl: boolean,
  total: number
}


const mapStateToProps = (state: AppState) => {
  return {
    formValue: state.form,
    productState: getProductState(state),
    invoicesState: getInvoiceState(state),
    items: getInvoiceItems(state),
    qty: getEditedQtyState(state),
    initialValues: {
      itemsGroup: getEditedProductsState(state),
      qtyGroup: getEditedQtyState(state),
      customer: getEditedCustomerState(state)
    }
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateInvoice: (id: string, payload: Invoices) => dispatch(Actions.updateInvoice(id, payload)),
  invoiceSaved: (payload: boolean) => dispatch(Actions.invoiceSaved(payload)),
  startSaveInvoice: () => dispatch(Actions.startSaveInvoice()),
  startUpdateInvoiceItems: (payload: number) => dispatch(Actions.startUpdateInvoiceItems(payload)),
  startInsertInvoiceItems: () => dispatch(Actions.startInsertInvoice()),
  setCurrentEditedItem: (id: string, product: string, quantity: number) => dispatch(Actions.setCurrentEditedItem(id, product, quantity)),
  startUpdateInvoiceCustomer: () => dispatch(Actions.startUpdateInvoiceCustomer()),
  fetchInvoicesStart: () => dispatch(Actions.fetchInvoicesStart())
});


type Props =
  & ReturnType<typeof mapDispatchToProps>
  & ReturnType<typeof mapStateToProps>
  & PropsOwn
  & RouteComponentProps
  ;


function CreateForm(props: Props) {

  const refPrice = useRef(null);
  const [currentEditedID, setCurrentEditedID] = useState('');

  const {
    history,
    formValue,
    invoicesState,
    endsUrl,
    invoice,
    products,
    productState,
    customers,
    items,
    startSaveInvoice,
    startUpdateInvoiceItems,
    startInsertInvoiceItems,
    setCurrentEditedItem,
    total,
    startUpdateInvoiceCustomer
  } = props;

  let customer: string = '';
   if(formValue.addInvoice && formValue.addInvoice.values) {
     customer = formValue.addInvoice.values.customer;
   }

  const [price, setPrice] = useState(1);
  // ERRORS
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);

  const setPriseDynamic = useCallback(() => {
    if (products
      && formValue.addInvoice
      && formValue.addInvoice.values
      && formValue.addInvoice.values.product
      && formValue.addInvoice.values.qty) {
      setPrice(productState.products[formValue.addInvoice.values.product].price * Number(formValue.addInvoice.values.qty));
    }

  }, [formValue.addInvoice, productState.products, products]);

  const validator = () => {
    if (formValue.addInvoice && 'syncErrors' in formValue.addInvoice) {
      if (formValue.anyTouched) {
        setIsError(true);
      }
    } else {
      setErrors('');
      setIsError(false);
    }
  };

  const createInvoice = () => {
    if (formValue.addInvoice.values) {
      // Validation
      if ('syncErrors' in formValue.addInvoice) {
        const syncErrors: {} = formValue.addInvoice['syncErrors'];
        setErrors(`Fields : ${Object.keys(syncErrors)} is required`);
        setIsError(true);
      } else {
        history.push('/invoices/');
        setErrors('');
        setIsError(false);
      }

      if (!isError) {
        startSaveInvoice();
      }
    }

  };

  const editInvoice = useCallback(() => {
    startUpdateInvoiceItems(total);
  }, [startUpdateInvoiceItems, total]);

  const insertInvoiceItem = () => {
    startInsertInvoiceItems();
  };

  const submitForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!endsUrl) {
      createInvoice();
    }
    if (endsUrl) {
      editInvoice();
    }
    if (endsUrl && formValue.addInvoice && formValue.addInvoice.values && formValue.addInvoice.values.qty) {
      insertInvoiceItem();
    }
  };

  useEffect(() => {
      if (products
        && formValue.addInvoice
        && formValue.addInvoice.values
        && formValue.addInvoice.values.qty !== '') {
        setPriseDynamic();
      }
      validator();

      // Set edited items to STORE
      if (formValue.addInvoice && formValue.addInvoice.anyTouched && formValue.addInvoice && formValue.addInvoice.values) {
        setCurrentEditedItem(currentEditedID, formValue.addInvoice.values.itemsGroup[currentEditedID], Number(formValue.addInvoice.values.qtyGroup[currentEditedID]));
      }

      // auto update
      if (
        endsUrl
        && invoice
        && formValue.addInvoice
        && formValue.addInvoice.values) {
        editInvoice();
      }
    },
    [formValue.addInvoice, productState, endsUrl, invoice, products, customers, items, currentEditedID, editInvoice, setPriseDynamic, validator, setCurrentEditedItem]
  );
  // Fetch invoices
  useEffect(() => {
    props.fetchInvoicesStart()
  }, [invoice]);

  // Update invoice customer
  useEffect(() => {
    if(formValue.addInvoice && formValue.addInvoice.values) {
      startUpdateInvoiceCustomer();
    }

  }, [customer, total]);

  // Set Edited item ID
  const handleChangeProduct = (e: any) => {
    let itemID = '';
    if (e.target && e.target.tagName && e.target.tagName.toUpperCase() === 'TD') {
      itemID = e.target['data-name'];
    } else {
      itemID = e.target.name.split('.')[1];
    }
    setCurrentEditedID(itemID);
  };

  return (
    <ErrorBoundary>
      {/*  Redirect when EMPTY invoices */}
      {invoicesState.ids.length === 0 && <Redirect to="/invoices/create"/>}
      <form
        className='create-form'
        onSubmit={submitForm}
      >
        {errors && <h4>{errors}</h4>}

        <div className='form-content'>
          {/* FORM LEFT PART */}
          <div className='form-left'>
            {/* Field Select Customer */}
            <Field
              className='name-select'
              name="customer"
              iterableObj={customers}
              component={customSelect}
            />

            {/* SELECT PRODUCT SECTION  */}
            <div className='view-products'>
              <table className='view-table create-table'>
                <tbody ref={refPrice}>
                <tr>
                  <th className='view-table--title'>Products</th>
                  <th className='view-table--title'>Qty</th>
                  <th className='view-table--title'>Price</th>
                </tr>
                {/* TASKS FROM INVOICE  */}

                {invoice && endsUrl && items && items.map((item: any) => {
                  return (
                    <tr key={item.id} onClick={handleChangeProduct}>
                      <td>
                        <FormSection name='itemsGroup'>
                          <Field
                            className='name-select'
                            name={`${item.id}`}

                            component="select"
                          >
                            {products.map((items: Products) => {
                                return (
                                  <option

                                    key={items.id}
                                    value={items.id}>{items.name}</option>
                                );
                              }
                            )}

                          </Field>
                        </FormSection>

                      </td>
                      <td>
                        {/*  task qty */}
                        <FormSection name='qtyGroup'>
                          <Field
                            component="input"
                            type='number'
                            name={`${item.id}`}
                            min='1'
                            className="select-editable"
                          >
                          </Field>
                        </FormSection>

                      </td>
                      {/* items price */}
                      <td className='table-price' data-name={`${item.id}`}>
                        {formValue
                        && formValue.addInvoice
                        && formValue.addInvoice.values
                        && formValue.addInvoice.values.qtyGroup
                        &&
                        productState.products[item.product_id].price
                        * formValue.addInvoice.values.qtyGroup[item.id] || 1
                        }
                      </td>
                    </tr>
                  );
                })}
                {/* ======  Product  ======= */}
                <tr>
                  <td className='select-style'>
                    <Field
                      className='name-select'
                      name='product'
                      iterableObj={products}
                      component={customSelect}
                    />
                  </td>
                  {/* ==========  quantity ==========*/}
                  <td className='item-focus'>
                    <div>
                      <Field
                        component={customInputNumber}
                        type='number'
                        name='qty'
                        min='1'
                        max='10'
                        className="select-editable"
                      />
                    </div>

                  </td>
                  {/* ============= Price =============  */}
                  <td className='item-focus'>
                    {price}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FORM RIGHT PART */}
          <div className='form-right'>
            <div className='viev-discount-title'>Discount %</div>
            <div className='view-discount-number'>
              {/*  mathc create page */}
              {!endsUrl && <Field
                className="select-editable"
                name='discount'
                component={customInputNumber}
                type='number'
                min='1'
                max='50'
              >
              </Field>}
              {/*  match edit page */}
              {endsUrl && invoice && <span>{invoice.discount}</span>}
            </div>
          </div>
        </div>
        {/* ===========  SUBMIT BUTTON =========   */}
        {<button
          type="submit"
          disabled={isError}
          className='submit-button'>Save invoice
        </button>}
      </form>
    </ErrorBoundary>
  );

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  reduxForm<{}, Props>({
    form: 'addInvoice',
    validate: myValidator,
    enableReinitialize: true
  })(React.memo(CreateForm))));

