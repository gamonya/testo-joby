import { Epic, ofType } from 'redux-observable';
import { uniqueId } from 'lodash';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import invoicesService from '../../shared/services/invoicesService';
import { from, of } from 'rxjs';
import discountCalculator from '../../shared/utils/discountCalculator';

export const fetchInvoicesEpic: Epic<ActionTypeUnion, ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICES_START),
    mergeMap(() => {
      return from(invoicesService.fetchInvoices()).pipe(
        map((res: any) => Actions.fetchInvoicesSuccess(res)),
        catchError((err: string) => of(Actions.fetchInvoicesError(`invoices: ${err}`)))
      );
    })
  );
};


export const saveInvoice: Epic<ActionTypeUnion, any> = (action$, state) => {
  return action$.pipe(
    ofType(ActionTypes.START_SAVE),
    mergeMap((): any => {
      if (state.value.form.addInvoice.values) {
        if (state.value.form.addInvoice.values.product) {
          const { value } = state;
          // NEXT ID
          const invoiceIdsArray = Object.keys(value.invoices.invoices).map(Number);
          const nextID = Math.max.apply(null, invoiceIdsArray) + 1;
          // PRICE
          const price = value.products.products[Number(value.form.addInvoice.values.product)].price * Number(value.form.addInvoice.values.qty);
          // INVOICE OBJECT
          const invoice = {
            id: nextID,
            customer_id: Number(value.form.addInvoice.values.customer),
            discount: Number(value.form.addInvoice.values.discount),
            total: discountCalculator(price, Number(value.form.addInvoice.values.discount)),
            items: [{
              id: Number(uniqueId()),
              invoice_id: nextID,
              product_id: Number(value.form.addInvoice.values.product),
              quantity: Number(value.form.addInvoice.values.qty)
            }]
          };
          return of(Actions.addInvoice(invoice), Actions.invoiceSaved(true), Actions.invoiceSaved(false));
        } else {
          return of(Actions.invoiceSaved(false));
        }
      }
    })
  );
};

export const startUpdate: Epic<ActionTypeUnion, any> = (action$, state) => {
  return action$.pipe(
    ofType(ActionTypes.START_UPDATE),
    mergeMap((action: any): any => {

      if (state.value.form.addInvoice.values) {
        const { values } = state.value.form.addInvoice;
        const invoice = state.value.invoices.invoices[state.value.invoices.currentIdInvoice];
        const editedResults = [];

        for (let item in values.qtyGroup) {
          const itemsValuesFromEdit = {
            id: Number(item),
            invoice_id: Number(invoice.id),
            quantity: Number(values.qtyGroup[item]),
            product_id: Number(values.itemsGroup[item])
          };
          editedResults.push(itemsValuesFromEdit);
        }

        if (values.product && values.qty) {
          editedResults.push({
            id: Number(uniqueId()),
            invoice_id: Number(invoice.id),
            quantity: Number(values.qty),
            product_id: Number(values.product)
          });
        }

        if (state.value.form) {
          return of(Actions.updateInvoice(invoice.id, {
            id: Number(invoice.id),
            customer_id: values.customer,
            discount: Number(invoice.discount),
            total: discountCalculator(action.payload, invoice.discount),
            items: editedResults
          }));
        }
      }
    })
  );
};