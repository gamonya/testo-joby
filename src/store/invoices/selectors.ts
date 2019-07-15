import { createSelector } from 'reselect';

import { AppState } from '../index';
import { InvoiseState } from './types';

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
  getInvoiceState,
  (state: InvoiseState) => state.invoices[state.currentIdInvoice]
);

export const genereteNextIdInvoice = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    const invoiceIdsArray = Object.keys(state.invoices).map(Number);
    return Math.max.apply(null, invoiceIdsArray) + 1;
  }
);

export const getCurrenInvoiceId = createSelector(
  getInvoiceState,
  (state: InvoiseState) => state.currentIdInvoice
);

export const getEditedQtyState = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice]) {
      let result = state.invoices[state.currentIdInvoice].items.map((item: any) => {
        return { [item.id]: item.quantity };
      });
      return result.reduce((acc: any, item: any) => {
        return {
          ...acc,
          [Number(Object.keys(item))]: item[Number(Object.keys(item))]
        };
      });
    }
  }
);

export const getEditedProductsState = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice]) {
      let result = state.invoices[state.currentIdInvoice].items.map((item: any) => {
        return { [item.id]: item.product_id };
      });
      return result.reduce((acc: any, item: any) => {
        return {
          ...acc,
          [Number(Object.keys(item))]: item[Number(Object.keys(item))]
        };
      });
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




export const getTotalCount = createSelector(
  getInvoiceState,
  (state: InvoiseState) => {
    if (state.invoices[state.currentIdInvoice]) {
      let result = state.invoices[state.currentIdInvoice].items.map((item: any) => {
        return { [item.id]: {[item.product_id]:item.quantity}};
      });
      const items = result.reduce((acc: any, item: any, index) => {
        return {
          ...acc,
          [Number(Object.keys(item))]: item[Object.keys(item).toString()]
        }
      });
      return Object.values(items)
    }
  }
);