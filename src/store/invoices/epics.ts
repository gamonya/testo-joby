import { Epic, ofType } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import {  mergeMap, map, catchError, mapTo } from 'rxjs/operators';
import invoicesService from '../../shared/services/invoicesService';
import { from, of } from 'rxjs';


export const fetchInvoicesEpic: Epic<ActionTypeUnion, any> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_INVOICES_START),
    mergeMap((): any => {
      return from(invoicesService.fetchInvoices()).pipe(
        map((res: any )=> Actions.fetchInvoicesSuccess(res)),
        catchError((err): any => of(Actions.fetchInvoicesError(`invoices: ${err}`)))
      )
    })
  )
};

export const invoiceSaved:  Epic<ActionTypeUnion, any> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.ADD_INVOICE),
    mapTo(Actions.invoiceSaved(true))
  )
}