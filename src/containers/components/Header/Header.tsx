import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Badge from '@material-ui/core/Badge';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1)
    },
    padding: {
      padding: theme.spacing(0, 1)
    }
  })
);

function Header({ activeInvoicesCount }: Props) {
  const classes = useStyles();
  return (
    <header className='header'>
      <Logo/>
      <Grid item>
        <ButtonGroup fullWidth aria-label="Header navigation" color="primary" variant="contained" size="large">
          <Button>
            <NavLink to='/customers/' activeClassName='is-active'>Customers</NavLink>
          </Button>
          <Button>
            <NavLink to='/products/' activeClassName='is-active'>Products</NavLink>
          </Button>
          <Button>
            <NavLink to='/invoices/' activeClassName='is-active'>
              <Badge color="error" badgeContent={activeInvoicesCount} className={classes.margin}>
                <span className={classes.padding}>Invoices</span>
              </Badge>
            </NavLink>
          </Button>
        </ButtonGroup>
      </Grid>
      <InvoiceButton/>
    </header>
  );
}

export default connect(mapStateToProps)(Header);