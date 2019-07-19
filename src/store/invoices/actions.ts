import { action, ActionType } from 'typesafe-actions';
import { Invoices, InvoiceItems } from './types';


export enum ActionTypes {
  FETCH_INVOICES_START = 'FETCH_INVOICES_START',
  FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS',
  FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE',

  FETCH_INVOICE_ITEMS= 'FETCH_INVOICE_ITEMS',
  ADD_INVOICE_ITEMS = 'ADD_INVOICE_ITEMS',

  SET_CURRENT_ID_INVOICE = 'SET_CURRENT_ID_INVOICE',
  ADD_INVOICE = 'ADD_INVOICE',
  REMOVE_INVOICE = 'REMOVE_INVOICE',

  UPDATE_INVOICE = 'UPDATE_INVOICE',
  UPDATE_INVOICE_SUCCESS = 'UPDATE_INVOICE_SUCCESS',
  INSERT_ITEM = 'INSERT_ITEM',
  INSERT_ITEMS_SUCCESS = 'INSERT_ITEMS_SUCCESS',

  START_SAVE_INVOICE = 'START_SAVE_INVOICE',
  START_UPDATE_INVOICE ='START_UPDATE_INVOICE',
  START_INSERT_ITEMS = 'START_INSERT_ITEMS',


  SET_CURRENT_TOTAL_COUNT = 'SET_CURRENT_TOTAL_COUNT',
  INVOICE_SAIVED = 'INVOICE_SAIVED',
  START_DELETE_INVOICE = 'START_DELETE_INVOICE',
}

export const Actions = {
  setCurrentIdInvoice: (id: string) => action(ActionTypes.SET_CURRENT_ID_INVOICE, id),

  fetchInvoicesStart: () => action(ActionTypes.FETCH_INVOICES_START),
  fetchInvoicesSuccess: (payload: Invoices[]) => action(ActionTypes.FETCH_INVOICES_SUCCESS, payload),
  fetchInvoicesError: (payload: string) => action(ActionTypes.FETCH_INVOICES_FAILURE, payload),

  fetchInvoiceItems: (id: string) => action(ActionTypes.FETCH_INVOICE_ITEMS, id),

  addInvoiceItems: (payload: InvoiceItems[]) => action(ActionTypes.ADD_INVOICE_ITEMS, payload),
  // CRUD  ACTION
  addInvoice: (payload: Invoices) => action(ActionTypes.ADD_INVOICE, payload),
  removeInvoice: (id: string) => action(ActionTypes.REMOVE_INVOICE, id),

  updateInvoice: (id: string, invoices: Invoices) => action(ActionTypes.UPDATE_INVOICE, {id, invoices}),
  updateInvoiceSuccess: () => action(ActionTypes.UPDATE_INVOICE_SUCCESS),
  insertItem: (payload: InvoiceItems) => action(ActionTypes.INSERT_ITEM, payload),

  insertItemSuccess: () => action(ActionTypes.INSERT_ITEMS_SUCCESS),

  invoiceSaved: (payload: boolean) => action(ActionTypes.INVOICE_SAIVED, payload),
  // START EPICS
  startSave: () => action(ActionTypes.START_SAVE_INVOICE),
  startInsertInvoice: () => action(ActionTypes.START_INSERT_ITEMS),
  startUpdate: (payload: number) => action(ActionTypes.START_UPDATE_INVOICE, payload),
  startDeleteInvoice: (id: string) => action(ActionTypes.START_DELETE_INVOICE, id),
  //
  setCurrentTotalCount: (payload: number) => action(ActionTypes.SET_CURRENT_TOTAL_COUNT, payload),

};

export type ActionTypeUnion = ActionType<typeof Actions>;