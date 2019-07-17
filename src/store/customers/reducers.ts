import { CustomersState } from './types';
import { ActionTypeUnion, ActionTypes } from './actions';

const initialState: CustomersState = {
  customers: {},
  ids: [],
  error: null,
  isLoading: true
};

export function reducer(
  state = initialState,
  action: ActionTypeUnion
): CustomersState {
  switch (action.type) {
    case ActionTypes.FETCH_CUSTOMERS_SUCCESS: {
      const customers = action.payload.reduce((acc, customer) => ({
        ...acc,
        [customer.id]: customer,
      }), state.customers);

      const ids = Object.keys(customers);

      return {
        ...state,
        ids,
        isLoading: false,
        customers
      }
    }
    case ActionTypes.FETCH_CUSTOMERS_FAILURE: {
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
  