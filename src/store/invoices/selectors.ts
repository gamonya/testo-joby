import { createSelector } from 'reselect';

import { AppState } from '../index';
import { InvoiceItems, InvoiseState } from './types';

export const getInvoiceState = (state: AppState) => state.invoices;

export const getInvoices = createSelector(
  [getInvoiceState],
  (state: InvoiseState) => Object.values(state.invoices)
);

export const getActiveInvoicesCount = createSelector(
  [getInvoiceState],
  (state: InvoiseState) => Object.keys(state.invoices).length
);

export const getInvoiceById = createSelector(
  [getInvoiceState, getInvoices],
  (state: InvoiseState) => state.invoices[state.currentIdInvoice]
);

export const genereteNextIdInvoice = createSelector(
  [getInvoiceState, getInvoices],
  (state: InvoiseState) => {
    const invoiceIdsArray = Object.keys(state.invoices).map(Number);
    return Math.max.apply(null, invoiceIdsArray) + 1;
  }
);

export const getCurrentInvoiceId = createSelector(
  getInvoiceState,
  (state: InvoiseState) => state.currentIdInvoice
);
// STATE FOR EDIT PAGE DEFAULT VALUES
export const getEditedQtyState = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice] && state.invoices[state.currentIdInvoice].items) {
      let result = state.invoices[state.currentIdInvoice].items.map((item: any) => {
        return { [item.id]: item.quantity };
      });
      return result.reduce((acc: any, item: any) => {
        return {
          ...acc,
          [Number(Object.keys(item))]: item[Number(Object.keys(item))]
        };
      }, []);
    }
  }
);

export const getEditedProductsState = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice] && state.invoices[state.currentIdInvoice].items) {
      let result = state.invoices[state.currentIdInvoice].items.map((item: any) => {
        return { [item.id]: item.product_id };
      });
      return result.reduce((acc: any, item: any) => {
        return {
          ...acc,
          [Number(Object.keys(item))]: item[Number(Object.keys(item))]
        };
      }, []);
    }
  }
);

export const getEditedCustomerState = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice]) {
      return state.invoices[state.currentIdInvoice].customer_id;
    }
  }
);