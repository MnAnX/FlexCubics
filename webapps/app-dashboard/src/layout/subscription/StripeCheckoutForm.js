import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import {CardElement} from 'react-stripe-elements';

class StripeCheckoutForm extends React.Component {
  state = {
    name: '',
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.stripe.createToken({name: this.state.name}).then(({token}) => {
      this.props.onSubmit(token)
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name of Card Holder
            <br />
            <input type="text" value={this.state.name} onChange={(event)=>this.setState({name: event.target.value})} style={{fontSize: '18'}}/>
          </label>
          <br /><br />
          <label>
            Card details
            <CardElement style={{base: {fontSize: '18px'}}} />
          </label>
          <br /><br />
          <button style={{fontSize: '16'}}>Confirm order</button>
        </form>
        <br />
        <img style={{width: 150}} src={require('../../resources/images/stripe_logo.png')} />
      </div>
    );
  }
}

export default injectStripe(StripeCheckoutForm);
