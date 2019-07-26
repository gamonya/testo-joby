import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';

import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import './invoiceButton.css';
import { Actions } from '../../../store/invoices/actions';


const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetInvoiceId: (id: string) => dispatch(Actions.setCurrentIdInvoice(id))
});


type Props =
  & ReturnType<typeof mapDispatchToProps>
  ;

function InvoiceButton(props: Props) {

  const resetInvoiceId = () => {
    props.resetInvoiceId('');
  };

  return (
    <NavLink to='/invoices/create/'>
      <Fab variant="extended" aria-label="create" onClick={resetInvoiceId}>
        <Icon>add</Icon>
        New Invoice
      </Fab>
    </NavLink>
  );
}

export default connect(null, mapDispatchToProps)(InvoiceButton);