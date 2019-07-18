import { Epic, ofType, ActionsObservable, StateObservable } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import invoicesService from '../../shared/services/invoicesService';
import { of } from 'rxjs';
import discountCalculator from '../../shared/utils/discountCalculator';
import { AppState } from '../index';


export const fetchInvoicesEpic: Epic<ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICES_START),
    switchMap(() => {
      return invoicesService.fetchInvoices().pipe(
        map((res: any) => {

          const invoices: any = [];
          res.map((items: any) => {
            delete items['updatedAt'];
            delete items['createdAt'];
            invoices.push({
              id: items._id,
              customer_id: items.customer_id,
              discount: items.discount,
              total: items.total
            })
          });
          return Actions.fetchInvoicesSuccess(invoices);
        }),
        catchError((err: string) => of(Actions.fetchInvoicesError(`invoices: ${err}`)))
      );
    })
  );
};


export const fetchInvoicesItems = (action$: ActionsObservable<ActionTypeUnion>) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICE_ITEMS),
    switchMap((action: any): any => {
      return invoicesService.getInvoiceItems(action.payload).pipe(
        map((res: any) => {
          const item: any = [];
          res.response.map((items: any) => {
            delete items['updatedAt'];
            delete items['createdAt'];
            item.push({
              id: items._id,
              invoice_id: items.invoice_id,
              product_id: items.product_id,
              quantity: items.quantity
            })
          });
          return Actions.addInvoiceItems(item)
        }),
      );
    })
  );
};


export const saveInvoice = (action$: ActionsObservable<ActionTypeUnion>, state: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(ActionTypes.START_SAVE),
    mergeMap((): any => {
      if (state.value.form.addInvoice.values) {
        if (state.value.form.addInvoice.values.product) {
          const { value } = state;
          // PRICE
          const price = value.products.products[value!.form.addInvoice.values!.product].price * Number(value.form.addInvoice.values!.qty);
          const invoice = {
            customer_id: value.form.addInvoice.values!.customer.toString(),
            discount: Number(value.form.addInvoice.values!.discount),
            total: discountCalculator(price, Number(value.form.addInvoice.values!.discount))
          };
          // SAVE INVOICE
          return invoicesService.addInvoice(invoice).pipe(
            switchMap(((res: any): any => {
              const items = [{
                invoice_id: res.response._id,
                product_id: value.form.addInvoice.values!.product,
                quantity: Number(value.form.addInvoice.values!.qty)
              }];
              // SAVE INVOICE ITEMS
              return invoicesService.addInvoiceItem(res.response._id, items).pipe(
                map((value) => {
                  const invoice = {
                    id: res.response._id,
                    customer_id: res.response.customer_id,
                    discount: res.response.discount,
                    total: res.response.total,
                    items: value.response
                  };
                  return Actions.addInvoice(invoice);
                })
              );
            }))
          );
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
        console.log(editedResults)

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

export const deleteInvoice = (action$: ActionsObservable<ActionTypeUnion>) => {
  return action$.pipe(
    ofType(ActionTypes.START_DELETE_INVOICE),
    mergeMap((action: any): any => {
      return invoicesService.deleteInvoice(action.payload).pipe(
        map((res) => {
          return Actions.removeInvoice(res.response._id);
        }),
        catchError(() => of(Actions.fetchInvoicesError(`invoices delete error`)))
      );
    })
  );
};