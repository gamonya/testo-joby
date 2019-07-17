import { ProductsState } from './types';

import { ActionTypeUnion, ActionTypes } from './actions';

const initialState: ProductsState = {
  products: {},
  error: '',
  ids: [],
  isLoading: true
};

export function reducer(
  state = initialState,
  action: ActionTypeUnion
): ProductsState {
  switch (action.type) {
    case ActionTypes.FETCH_PRODUCTS_SUCCESS: {
      const products = action.payload.reduce((acc, product) => ({
        ...acc,
        [product.id]: product,
      }), state.products);

      const ids = Object.keys(products);

      return {
        ...state,
        ids,
        isLoading: false,
        products
      }
    }
    case ActionTypes.FETCH_PRODUCTS_FAILURE: {
      return {
        ...state,
        error: action.payload
      }
    }
    default: {
      return state;
    }
  }
}
