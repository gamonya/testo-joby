import { action, ActionType } from 'typesafe-actions';
import { Customers } from './types';

export enum ActionTypes {
  FETCH_CUSTOMERS_START = 'FETCH_CUSTOMERS_START',
  FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS',
  FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE',
}

export const Actions = {
  fetchCustomersStart: () => action(ActionTypes.FETCH_CUSTOMERS_START),
  fetchCustomersSuccess: (payload: Customers[]) => action(ActionTypes.FETCH_CUSTOMERS_SUCCESS, payload),
  fetchCustomersError: (payload: string) => action(ActionTypes.FETCH_CUSTOMERS_FAILURE, payload)
};

export type ActionTypeUnion = ActionType<typeof Actions>;