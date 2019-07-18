import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { reducer as formReducer } from 'redux-form';

import {  StateType } from 'typesafe-actions';
import { composeWithDevTools } from "redux-devtools-extension";

import { reducer as productsReducer } from "./products/reducers";
import { reducer as customersReducer } from "./customers/reducers";
import { reducer as invoicesReducer } from "./invoices/reducers";
// EPICS
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import {  fetchCustomersEpic } from './customers/epics';
import { fetchProductsEpic } from './products/epics';
import { fetchInvoicesEpic, saveInvoice, startUpdate, deleteInvoice } from './invoices/epics';


const rootEpic = combineEpics(
  fetchCustomersEpic,
  fetchProductsEpic,
  fetchInvoicesEpic,
  saveInvoice,
  startUpdate,
  deleteInvoice
);

const epicMiddleware = createEpicMiddleware();
//
const reducer = combineReducers({
  products: productsReducer,
  customers: customersReducer,
  invoices: invoicesReducer,
  form: formReducer
});

export type AppState = StateType<typeof reducer>;

function configureStore(preloadedState: any) {
  const middlewares = [thunk, epicMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers: any = composeWithDevTools(...enhancers);

  const store = createStore(reducer, preloadedState, composedEnhancers);

  epicMiddleware.run(rootEpic);

  return store;
}

export const rootStore = configureStore(undefined);
