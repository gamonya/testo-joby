import { Epic, ofType } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import CustomersService from '../../shared/services/customersService';
import { from, of } from 'rxjs';


export const fetchCustomersEpic: Epic<ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_CUSTOMERS_START),
    mergeMap(() => {
      return from(CustomersService.getCustomers()).pipe(
        map((res: any) => Actions.fetchCustomersSuccess(res)),
        catchError((err: string) => of(Actions.fetchCustomersError(`customers: ${err}`)))
      );
    })
  );
};
