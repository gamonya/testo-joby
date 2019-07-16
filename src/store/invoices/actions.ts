import { action, ActionType } from 'typesafe-actions';
import { Invoices } from './types';


export enum ActionTypes {
  FETCH_INVOICES_START = 'FETCH_INVOICES_START',
  FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS',
  FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE',
  SET_CURRENT_ID_INVOICE = 'SET_CURRENT_ID_INVOICE',
  ADD_INVOICE = 'ADD_INVOICE',
  REMOVE_INVOICE = 'REMOVE_INVOICE',
  UPDATE_INVOICE = 'UPDATE_INVOICE',
  // START_SAVE = 'START_SAVE',
  // SET_CURRENT_TOTAL_COUNT = 'SET_CURRENT_TOTAL_COUNT',
  INVOICE_SAIVED = 'INVOICE_SAIVED'
}

export const Actions = {
  setCurrentIdInvoice: (id: number) => action(ActionTypes.SET_CURRENT_ID_INVOICE, id),
  fetchInvoicesStart: () => action(ActionTypes.FETCH_INVOICES_START),
  fetchInvoicesSuccess: (payload: Invoices[]) => action(ActionTypes.FETCH_INVOICES_SUCCESS, payload),
  fetchInvoicesError: (payload: any) => action(ActionTypes.FETCH_INVOICES_FAILURE, payload),
  addInvoice: (payload: Invoices) => action(ActionTypes.ADD_INVOICE, payload),
  removeInvoice: (id: number) => action(ActionTypes.REMOVE_INVOICE, id),
  invoiceSaved: (payload: boolean) => action(ActionTypes.INVOICE_SAIVED, payload),
  startSave: (payload: boolean) => action(ActionTypes.INVOICE_SAIVED, payload),
  // setCurrentTotalCount: (payload: number) => action(ActionTypes.SET_CURRENT_TOTAL_COUNT, payload),
  updateInvoice: (id: number, invoices: Invoices) => action(ActionTypes.UPDATE_INVOICE, {id, invoices})
};

export type ActionTypeUnion = ActionType<typeof Actions>;