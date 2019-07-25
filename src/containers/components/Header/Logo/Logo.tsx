import React, { FunctionComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {  RouteComponentProps, withRouter } from 'react-router-dom';

import './logo.css'
import { AppState } from '../../../../store';

const mapStateToProps = (state: AppState) => {
      return {
        formValue: state,
      }
    };

type Props = & RouteComponentProps & ReturnType<typeof mapStateToProps>

function Logo(props: Props) {
    const toMainPage = () => {
        if(props.formValue.form.addInvoice) {
            if (props.formValue.form.addInvoice.anyTouched && !props.formValue.invoices.isInvoiceSaved) {
                if(window.confirm("no save...go to main?")) {
                    props.history.push('/')
                } else {
                  return
                }
            }
        }
      props.history.push('/')
    };

    return (
        <div className='logo' onClick={toMainPage} >
            Logo
        </div>
    )
}
export default compose(
    withRouter,
    connect(mapStateToProps)
)(Logo) as FunctionComponent