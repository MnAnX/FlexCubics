import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCheckoutForm from './StripeCheckoutForm';

class StripeCheckout extends React.Component {
  render() {
    return (
      <Elements>
        <InjectedCheckoutForm onSubmit={this.props.onSubmit}/>
      </Elements>
    );
  }
}

export default StripeCheckout;
