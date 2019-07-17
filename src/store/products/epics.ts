import { Epic, ofType } from 'redux-observable';
import { Actions, ActionTypes, ActionTypeUnion } from './actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import productsService from '../../shared/services/productsService';
import { from, of } from 'rxjs';

export const fetchProductsEpic: Epic<ActionTypeUnion> = (action$) => {
  return action$.pipe(
    ofType(ActionTypes.FETCH_PRODUCTS_START),
    switchMap(() => {
      return from(productsService.getProducts()).pipe(
        map((res: any) => {
          const products: any = [];
          res.map((items: any) => {
            delete items['updatedAt'];
            delete items['createdAt'];
            products.push({
              id: items._id,
              name: items.name,
              price: items.price
            })
          });
          return Actions.fetchProductsSuccess(products);
        }),
        catchError((err: string) => of(Actions.fetchProductsError(`products: ${err}`)))
      );
    })
  );
};
