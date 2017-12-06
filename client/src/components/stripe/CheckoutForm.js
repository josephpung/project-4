import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import axios from 'axios'

// import CardSection from './CardSection';

class CheckoutForm extends React.Component {
  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    // this.props.stripe.createToken({
    //   name: 'Yuki Tsuboniwa'}).then(({token}) => {
    //   console.log('Received Stripe token:', token);
    // });

    axios.post("charge", {
    })
    .then(res => console.log(res.data))


    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button>Pay Order</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
