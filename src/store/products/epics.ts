import { Epic, ofType } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import productsService from '../../shared/services/productsService';
import { from, of } from 'rxjs';

export const fetchProductsEpic: Epic<ActionTypeUnion, ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_PRODUCTS_START),
    mergeMap(() => {
      return from(productsService.getProducts()).pipe(
        map((res: any) => Actions.fetchProductsSuccess(res)),
        catchError((err: string) => of(Actions.fetchProductsError(`products: ${err}`)))
      );
    })
  );
};
