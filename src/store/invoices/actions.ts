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
  UPDATE_INVOICE_FAILURE = 'UPDATE_INVOICE_FAILURE',
  INSERT_ITEM = 'INSERT_ITEM',

  START_UPDATE_INVOICE_CUSTOMER = 'START_UPDATE_INVOICE_CUSTOMER',

  START_SAVE_INVOICE = 'START_SAVE_INVOICE',
  SAVE_INVOICE_FAILURE = 'SAVE_INVOICE_FAILURE',

  START_UPDATE_INVOICE_ITEMS ='START_UPDATE_INVOICE_ITEMS',
  UPDATE_INVOICE_ITEMS_SUCCESS = 'UPDATE_INVOICE_ITEMS_SUCCESS',
  UPDATE_INVOICE_ITEMS_FAILURE = 'UPDATE_INVOICE_ITEMS_FAILURE',

  START_INSERT_ITEMS = 'START_INSERT_ITEMS',

  SET_CURRENT_EDITED_ITEM = 'SET_CURRENT_EDITED_ITEM',
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
  // fix
  updateInvoiceFailure: (error: string) => action(ActionTypes.UPDATE_INVOICE_FAILURE, error),

  insertItem: (payload: InvoiceItems) => action(ActionTypes.INSERT_ITEM, payload),

  updateInvoiceItemsSuccess: (invoice_id: string) => action(ActionTypes.UPDATE_INVOICE_ITEMS_SUCCESS, invoice_id),
  updateInvoiceItemsFailure: (err: string) => action(ActionTypes.UPDATE_INVOICE_ITEMS_FAILURE, err),

  invoiceSaved: (payload: boolean) => action(ActionTypes.INVOICE_SAIVED, payload),
  // START EPICS
  startSaveInvoice: () => action(ActionTypes.START_SAVE_INVOICE),
  saveInvoiceFailure: (error: string) => action(ActionTypes.SAVE_INVOICE_FAILURE, error),

  startInsertInvoice: () => action(ActionTypes.START_INSERT_ITEMS),
  startUpdateInvoiceItems: (payload: number) => action(ActionTypes.START_UPDATE_INVOICE_ITEMS, payload),
  startDeleteInvoice: (id: string) => action(ActionTypes.START_DELETE_INVOICE, id),

  startUpdateInvoiceCustomer: () => action(ActionTypes.START_UPDATE_INVOICE_CUSTOMER),
  //
  setCurrentTotalCount: (payload: number) => action(ActionTypes.SET_CURRENT_TOTAL_COUNT, payload),
  setCurrentEditedItem: (item_id: string, product_id: string, quantity: number) => action(ActionTypes.SET_CURRENT_EDITED_ITEM, {item_id, product_id, quantity})

};

export type ActionTypeUnion = ActionType<typeof Actions>;