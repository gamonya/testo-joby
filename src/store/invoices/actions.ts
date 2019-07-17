import { action, ActionType } from 'typesafe-actions';
import { Invoices, NewInvoice } from './types';


export enum ActionTypes {
  FETCH_INVOICES_START = 'FETCH_INVOICES_START',
  FETCH_INVOICES_SUCCESS = 'FETCH_INVOICES_SUCCESS',
  FETCH_INVOICES_FAILURE = 'FETCH_INVOICES_FAILURE',
  SET_CURRENT_ID_INVOICE = 'SET_CURRENT_ID_INVOICE',
  ADD_INVOICE = 'ADD_INVOICE',
  REMOVE_INVOICE = 'REMOVE_INVOICE',
  UPDATE_INVOICE = 'UPDATE_INVOICE',
  START_SAVE = 'START_SAVE',
  START_UPDATE ='START_UPDATE',
  SET_CURRENT_TOTAL_COUNT = 'SET_CURRENT_TOTAL_COUNT',
  INVOICE_SAIVED = 'INVOICE_SAIVED'
}

export const Actions = {
  setCurrentIdInvoice: (id: string) => action(ActionTypes.SET_CURRENT_ID_INVOICE, id),
  fetchInvoicesStart: () => action(ActionTypes.FETCH_INVOICES_START),
  fetchInvoicesSuccess: (payload: Invoices[]) => action(ActionTypes.FETCH_INVOICES_SUCCESS, payload),
  fetchInvoicesError: (payload: string) => action(ActionTypes.FETCH_INVOICES_FAILURE, payload),
  addInvoice: (payload: NewInvoice) => action(ActionTypes.ADD_INVOICE, payload), // Исправить типизацию
  removeInvoice: (id: string) => action(ActionTypes.REMOVE_INVOICE, id),
  invoiceSaved: (payload: boolean) => action(ActionTypes.INVOICE_SAIVED, payload),
  startSave: () => action(ActionTypes.START_SAVE),
  startUpdate: (payload: number) => action(ActionTypes.START_UPDATE, payload),
  setCurrentTotalCount: (payload: number) => action(ActionTypes.SET_CURRENT_TOTAL_COUNT, payload),
  updateInvoice: (id: string, invoices: Invoices) => action(ActionTypes.UPDATE_INVOICE, {id, invoices})
};

export type ActionTypeUnion = ActionType<typeof Actions>;