import React from 'react';
import {Elements} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';
// import PaymentRequestForm from './PaymentRequestForm'
// <PaymentRequestForm />

class MyStoreCheckout extends React.Component {
  render() {
    return (
      <Elements>
        <CheckoutForm />
      </Elements>
    );
  }
}

export default MyStoreCheckout;
