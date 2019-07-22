import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

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
    <div className='wrapp-button' onClick={resetInvoiceId}>
      <NavLink to='/invoices/create/' className='invoice-button'>
        <span className='btn-plus'>+</span>
        <span>New Invoice</span>
      </NavLink>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(InvoiceButton);