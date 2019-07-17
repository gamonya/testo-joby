import { Epic, ofType } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import CustomersService from '../../shared/services/customersService';
import { of } from 'rxjs';

export const fetchCustomersEpic: Epic<ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_CUSTOMERS_START),
    switchMap(() => {
      return CustomersService.getCustomers().pipe(
        map((res: any) => {
          const customers: any = [];
          res.map((items: any) => {
            delete items['updatedAt'];
            delete items['createdAt'];
            customers.push({
              id: items._id,
              name: items.name,
              address: items.address,
              phone: items.phone
            })
          });
          return Actions.fetchCustomersSuccess(customers);
        }),
        catchError((err: string) => of(Actions.fetchCustomersError(`customers: ${err}`)))
      );
    })
  );
};
