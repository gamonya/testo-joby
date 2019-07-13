import React, { useState, useEffect, useRef } from 'react';
import myValidator from './validate';
import { Field, reduxForm, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { uniqueId } from 'lodash';

import { Products } from '../../../../store/products/types';
import { Customers } from '../../../../store/customers/types';
import { Dispatch } from 'redux';
import { Invoices } from '../../../../store/invoices/types';
import { Actions } from '../../../../store/invoices/actions';
import discountCalculator from '../../../../shared/utils/discountCalculator';
import { AppState } from '../../../../store';
import { getProductState } from '../../../../store/products/selectors';
import { customSelect, customInputNumber } from './customFields';

interface PropsOwn {
  products: Products[],
  customers: Customers[],
  invoice: Invoices,
  nextId: number,
  endsUrl: boolean
}


const mapStateToProps = (state: AppState) => {
  return {
    formValue: state.form,
    productState: getProductState(state),
    initialValues: {
      // customer: 2,
      // product: 1,
      // discount: 1,
      // qty: 1
    }
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addInvoice: (payload: Invoices) => dispatch(Actions.addInvoice(payload)),
  updateInvoice: (id: number, payload: Invoices) => dispatch(Actions.updateInvoice(id, payload))
});


type Props =
  & ReturnType<typeof mapDispatchToProps>
  & ReturnType<typeof mapStateToProps>
  & PropsOwn
  ;


function CreateForm(props: Props) {
  const refItems = useRef<any>(null);
  const { formValue } = props;

  const [price, setPrice] = useState(1);
  // ERRORS
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);

  const setPriseDynimic = () => {
    if (props.products 
      && formValue.addInvoice 
      && formValue.addInvoice.values 
      && formValue.addInvoice.values.qty) {
  setPrice(props.products[Number(formValue.addInvoice.values.product) - 1].price * Number(formValue.addInvoice.values.qty));
    }
  
  };

  const createInvoice = () => {
    if (formValue.addInvoice.values) {
      const { values } = formValue.addInvoice;

      console.log(formValue.addInvoice);
      // Validation
      if ('syncErrors' in formValue.addInvoice) {
        const syncErrors: {} = formValue.addInvoice['syncErrors'];
        setErrors(`Fields : ${Object.keys(syncErrors)} is required`);
        setIsError(true);
      } else {
        // props.history.push('/invoices/');
        setErrors('');
        setIsError(false);
      }
      
  
      const invoice = {
        id: props.nextId,
        customer_id: Number(values.customer),
        discount: Number(values.discount),
        total: discountCalculator(price, Number(values.discount)),
        items: [{
          id: Number(uniqueId()),
          invoice_id: props.nextId,
          product_id: Number(values.product),
          quantity: Number(values.qty)
        }]
      };
      if (!isError) {
        props.addInvoice(invoice);
      }
    }
  }
  
  const editInvoice = () => {
    if (formValue.addInvoice.values) {
      const {values} = formValue.addInvoice;
    const editedResults = []
     for(let item in values.qtyGroup) {
       const itemsValuesFromEdit = {
         id: Number(item),
         invoice_id: Number(props.invoice.id),
         quantity: Number(values.qtyGroup[item]),
         product_id: Number(values.itemsGroup[item])
       }
       editedResults.push(itemsValuesFromEdit)
     }
     if(values.product && values.qty) {
      editedResults.push({
        id: Number(uniqueId()),
        invoice_id: Number(props.invoice.id),
        quantity:  Number(values.qty),
        product_id: Number(values.product)
      })
     }
     props.updateInvoice(props.invoice.id, {
       id: Number(props.invoice.id),
       customer_id: values.customer,
       discount: Number(props.invoice.discount),
       total: 1000,
       items: editedResults
     })
     console.log(editedResults);
    }
  }
  const submitForm = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if(!props.endsUrl) {
      createInvoice();
    }
    if(props.endsUrl) {
      editInvoice();
    }
  };

  useEffect(() => {
      if (props.products 
        && formValue.addInvoice
        && formValue.addInvoice.values 
        && formValue.addInvoice.values.qty !== '') {
        setPriseDynimic();
      }
      if(refItems.current) {
        console.log(refItems.current);
      }
      
      if (formValue.addInvoice) {
        console.log(formValue.addInvoice.values);
      }
    }
    // [props.products]
  );

  return (
    <>
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
              iterableObj={props.customers}
              component={customSelect}
            />

            {/* SELECT PRODUCT SECTION  */}
            <div className='view-products'>
              <table className='view-table create-table'>
                <tbody>
                <tr>
                  <th className='view-table--title'>Products</th>
                  <th className='view-table--title'>Qty</th>
                  <th className='view-table--title'>Price</th>
                </tr>
                {/* TASKS FROM INVOICE  */}

                {props.invoice && props.endsUrl && props.invoice.items.map((item: any) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <FormSection name='itemsGroup'>
                        <Field
                          className='name-select'
                          name={`${item.id}`}
                        
                          component="select"
                        >
                          {props.products.map((items: any) => {
                              return (
                                <option
                                  key={items.id}
                                  value={items.id}>{items.name}</option>
                              )
                            }
                          )}

                        </Field>
                        </FormSection>
                       
                      </td>
                      <td >
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
                      <td>
                        {formValue 
                        && formValue.addInvoice 
                        && formValue.addInvoice.values 
                        && formValue.addInvoice.values.qtyGroup
                        &&
                          props.productState.products[item.product_id].price 
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
                      iterableObj={props.products}
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
             {!props.endsUrl && <Field
                className="select-editable"
                name='discount'
               component={customInputNumber}
                type='number'
                min='1'
                max='50'
              >
              </Field>}
              {/*  mathc edit page */}
              {props.endsUrl && props.invoice &&  <span>{props.invoice.discount}</span>}
            </div>
          </div>
        </div>
        {/* ===========  SUBMIT BUTTON =========   */}
        {!props.endsUrl && 
          <button
            type="submit"
            // disabled={submitting}
            className='submit-button'>Save invoice
          </button>
        }
         {props.endsUrl && 
          <button
            type="submit"
            // disabled={submitting}
            className='submit-button'>Edite invoice
          </button>
        }
      </form>
    </>
  );

}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm<{}, Props>({
     form: 'addInvoice', 
     validate: myValidator, 
     enableReinitialize: true 
    })(CreateForm));
