import React from 'react';
import {  Route, Switch  } from 'react-router-dom';

import ProductsPage from './Products/ProductsPage';
import CustomersPage from './Customers/CustomersPage';
import InvoicesPage from './Invoices/InvoicesPage';
import Header from './components/Header/Header';
import NoMatch from './NoMatch';
import MainPage from './MainPage/MainPage';
import ViewPage from './Invoices/ViewInvoice/ViewInvoice';
import CreateInvoice from './Invoices/CreateInvoice/CreacteInvoice';

import './App.css';

function App () {
   return (
       <div className='App'>
         <div className='container'>
           <Header />
           <main className='main'>
             <Switch>
               <Route path='/' exact  component={MainPage} />
               <Route path='/products/' component={ProductsPage} />
               <Route path='/customers/' component={CustomersPage} />

               <Route path='/invoices' exact component={InvoicesPage} />
               <Route path='/invoices/create/' component={CreateInvoice} />
               <Route path='/invoice/:id/view/' component={ViewPage} />
               <Route path='/invoice/:id/edit/' component={CreateInvoice} />

               <Route component={NoMatch}/>
             </Switch>
           </main>
         </div>
       </div>
   );
}

export default App;
