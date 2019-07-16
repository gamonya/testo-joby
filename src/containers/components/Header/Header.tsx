import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';


import './header.css';

import InvoiceButton from '../../../shared/components/InvoiceButton/InvoiceButton';
import Logo from './Logo';
import { getActiveInvoicesCount } from '../../../store/invoices/selectors';
import { AppState } from '../../../store';

interface Invoices {
  activeInvoicesCount: number
}

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    activeInvoicesCount: getActiveInvoicesCount(state)
  };
};

type Props =
  & ReturnType<typeof mapStateToProps>
  & Invoices
  ;

function Header({activeInvoicesCount}: Props) {
  return (
    <header className='header'>
      <Logo/>
      <nav className='navigation'>
        <ul className='navigation-tabs'>
          <li className='navigation-items'>
            <NavLink to='/customers/' activeClassName='is-active'>Customers</NavLink>
          </li>
          <li className='navigation-items'>
            <NavLink to='/products/' activeClassName='is-active'>Products</NavLink>
          </li>
          <li className='navigation-items'>
            <NavLink to='/invoices/' activeClassName='is-active'>Invoices({activeInvoicesCount})</NavLink>
          </li>
        </ul>
      </nav>
      <InvoiceButton/>
    </header>
  );
}

export default connect(mapStateToProps)(Header);