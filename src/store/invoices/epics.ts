import { Epic, ofType } from 'redux-observable';
import { uniqueId } from 'lodash';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError, mapTo, tap } from 'rxjs/operators';
import invoicesService from '../../shared/services/invoicesService';
import { from, of } from 'rxjs';
import discountCalculator from '../../shared/utils/discountCalculator';


export const fetchInvoicesEpic: Epic<ActionTypeUnion, any> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICES_START),
    mergeMap((): any => {
      return from(invoicesService.fetchInvoices()).pipe(
        map((res: any) => Actions.fetchInvoicesSuccess(res)),
        catchError((err): any => of(Actions.fetchInvoicesError(`invoices: ${err}`)))
      );
    })
  );
};

export const invoiceSaved: Epic<ActionTypeUnion, any> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.ADD_INVOICE),
    mapTo(Actions.invoiceSaved(true))
  );
};

export const saveInvoice: Epic<ActionTypeUnion, any> = (action$, state) => {
  return action$.pipe(
    ofType(ActionTypes.START_SAVE),
    mergeMap((): any => {
      if (state.value.form.addInvoice.values) {
        // NEXT ID
        const invoiceIdsArray = Object.keys(state.value.invoices.invoices).map(Number);
        const nextID = Math.max.apply(null, invoiceIdsArray) + 1;
        // PRICE
        const price = state.value.products.products[Number(state.value.form.addInvoice.values.product)].price * Number(state.value.form.addInvoice.values.qty);
        // INVOICE OBJECT
        const invoice = {
          id: nextID,
          customer_id: Number(state.value.form.addInvoice.values.customer),
          discount: Number(state.value.form.addInvoice.values.discount),
          total: discountCalculator(price, Number(state.value.form.addInvoice.values.discount)),
          items: [{
            id: Number(uniqueId()),
            invoice_id: nextID,
            product_id: Number(state.value.form.addInvoice.values.product),
            quantity: Number(state.value.form.addInvoice.values.qty)
          }]
        };
        return of(Actions.addInvoice(invoice));

      }
    })
  );
};