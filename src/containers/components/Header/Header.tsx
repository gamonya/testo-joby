import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import './header.css';

import InvoiceButton from '../../../shared/components/InvoiceButton/InvoiceButton';
import Logo from './Logo/Logo';
import { getActiveInvoicesCount } from '../../../store/invoices/selectors';
import { AppState } from '../../../store';

// STORE PROPS
const mapStateToProps = (state: AppState) => {
  return {
    activeInvoicesCount: getActiveInvoicesCount(state)
  };
};

type Props =
  & ReturnType<typeof mapStateToProps>
  ;

function Header({activeInvoicesCount}: Props) {
  return (
    <header className='header'>
      <Logo/>
      <Grid item >
        <ButtonGroup fullWidth aria-label="Header navigation"  color="primary"  variant="contained"  size="large">
          <Button><NavLink to='/customers/' activeClassName='is-active'>Customers</NavLink></Button>
          <Button> <NavLink to='/products/' activeClassName='is-active'>Products</NavLink></Button>
          <Button> <NavLink to='/invoices/' activeClassName='is-active'>Invoices({activeInvoicesCount})</NavLink></Button>
        </ButtonGroup>
      </Grid>
      <InvoiceButton/>
    </header>
  );
}

export default connect(mapStateToProps)(Header);