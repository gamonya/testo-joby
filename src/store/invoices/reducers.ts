import {  InvoiseState } from './types';
import { ActionTypes, ActionTypeUnion } from './actions';
import omit from 'lodash/omit';


const initialState: InvoiseState = {
  currentIdInvoice: '',
  ids: [],
  isLoading: true,
  error: null,
  invoices: {},
  items: [],
  isInvoiceSaved: false,
  currentEditedItem: {
    item_id: '',
    product_id: '',
    quantity: 0
  },
  currentTotalCount: 0
};

export function reducer(
  state = initialState,
  action: ActionTypeUnion
): InvoiseState {
  switch (action.type) {
    case ActionTypes.FETCH_INVOICES_SUCCESS: {
      const invoices = action.payload.reduce((acc, invoice) => {
        return {
        ...acc,
        [invoice.id]: invoice,
      }}, state.invoices);

      const ids = Object.keys(invoices);

      return {
        ...state,
        ids,
        isLoading: false,
        invoices
      }
    }
    case ActionTypes.FETCH_INVOICES_FAILURE: {
     return {
       ...state,
       error: action.payload
     }
    }
    case ActionTypes.ADD_INVOICE_ITEMS: {
      return {
        ...state,
        items: action.payload
      }
    }
    case ActionTypes.ADD_INVOICE: {
      return {
        ...state,
        invoices: {
          ...state.invoices,
          [action.payload.id]: action.payload
        }
      }
    }
    case ActionTypes.UPDATE_INVOICE: {
      return {
        ...state,
        invoices: {
          ...state.invoices,
          [action.payload.id]: action.payload.invoices
        }
      }
    }
    case ActionTypes.SET_CURRENT_TOTAL_COUNT: {
      return {
        ...state,
        currentTotalCount: action.payload
      }
    }
    case ActionTypes.SET_CURRENT_EDITED_ITEM: {
      return {
        ...state,
        currentEditedItem: action.payload
      }
    }
    case ActionTypes.REMOVE_INVOICE: {
      const invoices = omit(state.invoices, action.payload);
      const ids = Object.keys(invoices);
      return {
        ...state,
        ids,
        invoices
      }
    }
    case ActionTypes.INVOICE_SAIVED: {
      return {
        ...state,
        isInvoiceSaved: action.payload
      }
    }
    case ActionTypes.INSERT_ITEM: {
      return {
        ...state,
        items: [
          ...state.items,
          action.payload
        ]
      }
    }
    case ActionTypes.SET_CURRENT_ID_INVOICE: {
      return {
        ...state,
        currentIdInvoice: action.payload
      }
    }
    default: {
      return state;
    }
  }
}
