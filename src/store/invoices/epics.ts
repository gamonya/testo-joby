import { Epic, ofType, ActionsObservable, StateObservable } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import invoicesService from '../../shared/services/invoicesService';
import { from, of } from 'rxjs';
import discountCalculator from '../../shared/utils/discountCalculator';
import { AppState } from '../index';


export const fetchInvoicesEpic: Epic<ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICES_START),
    switchMap(() => {
      return from(invoicesService.fetchInvoices()).pipe(
        map((res: any) => {
          const invoices: any = [];
          res.map((items: any) => {
            delete items['updatedAt'];
            delete items['createdAt'];
            invoices.push({
              id: items._id,
              customer_id: items.customer_id,
              discount: items.discount,
              total: items.total,
              items: items.items
            })
          });
          return Actions.fetchInvoicesSuccess(invoices)
        }),
        catchError((err: string) => of(Actions.fetchInvoicesError(`invoices: ${err}`)))
      );
    })
  );
};


export const saveInvoice= (action$: ActionsObservable<ActionTypeUnion>, state: StateObservable<AppState>) => {
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
          const price = value.products.products[Number(value!.form.addInvoice.values!.product)].price * Number(value.form.addInvoice.values!.qty);
          // INVOICE OBJECT
          const invoice = {
            id: 'string',
            customer_id: value.form.addInvoice.values!.customer.toString(),
            discount: Number(value.form.addInvoice.values!.discount),
            total: discountCalculator(price, Number(value.form.addInvoice.values!.discount)) || 0,
            items: [{
              id: 'das',
              invoice_id: nextID.toString(),
              product_id: value.form.addInvoice.values!.product,
              quantity: value.form.addInvoice.values!.qty
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

export const startUpdate = (action$: ActionsObservable<ActionTypeUnion>, state: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(ActionTypes.START_UPDATE),
    mergeMap((action: any): any => {
      if (state.value.form.addInvoice.values) {

        const { values } = state.value.form.addInvoice;
        const invoice = state.value.invoices.invoices[state.value.invoices.currentIdInvoice];
        const editedResults = [];

        for (let item in values.qtyGroup) {
          const itemsValuesFromEdit = {
            id: item,
            invoice_id: invoice.id,
            quantity: values.qtyGroup[item],
            product_id: values.itemsGroup[item]
          };
          editedResults.push(itemsValuesFromEdit);
        }

        if (values.product && values.qty) {
          editedResults.push({
            id: 'sdf',
            invoice_id: invoice.id.toString(),
            quantity: values.qty,
            product_id: values.product
          });
        }

        if (state.value.form) {
          return of(Actions.updateInvoice(invoice.id, {
            id: invoice.id,
            customer_id: values.customer,
            discount: Number(invoice.discount),
            total: discountCalculator(action.payload, invoice.discount || 0),
            items: editedResults
          }));
        }
      }
    })
  );
};