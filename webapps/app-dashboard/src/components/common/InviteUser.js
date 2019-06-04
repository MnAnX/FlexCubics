import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Loader from 'react-loader-advanced';

import NormalTextField from '../common/NormalTextField';
import NormalBigButton from '../common/NormalBigButton';
import ActionButton from '../common/ActionButton';

import colors from '../../styles/colors'
import Config from '../../config';
import { createRequestOptions } from '../../services/utils';


const style = {
	container: {
		display: 'flex',
		flexFlow: 'column'
	},
	buttons: {
		display: 'flex',
		flexFlow: 'row'
	}
}

class EmailSender extends Component {
	constructor(props) {
    super(props);

    this.state = {
			isLoading: false,
			email: "",
			name: "",
			text: this.props.note
							? this.props.note
							: "",
    }

		this.send = this.send.bind(this);
  }

	send() {
		this.setState({isLoading: true})

		const options = createRequestOptions({
			userId: this.props.userId,
	    appId: this.props.appId,
			email: this.state.email,
			name: this.state.name,
			text: this.state.text
		});

		fetch(Config.serverUrl + '/InviteUserToApp', options)
	    .then((response) => {
	      console.log("Send invite user email response: ", response.json())
				this.setState({isLoading: false})
	    })
	    .catch((error) => {
	      console.error("Error sending invite user email: " + error);
	    });
	}

	validateEmail(email) {
		if(_.isEmpty(email)) {
			return "Email address is required"
		}
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email).toLowerCase())) {
			//valid email address
			return ""
		} else {
			return "Invalid email address"
		}
	}

  render() {
    return (
			<div>
			<Loader show={this.state.isLoading} message={'Sending email...'}>
				<NormalTextField
					floatingLabelText="Name"
					fullWidth={true}
					errorText={_.isEmpty(this.state.name) ? "Invitee name is required" : ""}
					value={this.state.name}
					onChange={(event)=>{this.setState({name: event.target.value})}}
				/>
				<NormalTextField
					floatingLabelText="Email"
					fullWidth={true}
					errorText={this.validateEmail(this.state.email)}
					value={this.state.email}
					onChange={(event)=>{this.setState({email: event.target.value})}}
				/>
				<NormalTextField
					floatingLabelText="Note"
					fullWidth={true}
					multiLine={true}
					rows={5}
					rowsMax={10}
					value={this.state.text}
					onChange={(event)=>{this.setState({text: event.target.value})}}
				/>
				<div style={style.buttons}>
					<NormalBigButton label="Cancel" onClick={()=>this.props.onComplete()} />
					<ActionButton label="Send" disabled={_.isEmpty(this.state.email)}
						onClick={()=>{
							this.send();
							this.props.onComplete();
						}}
					/>
				</div>
			</Loader>
			</div>
    );
	}
}

EmailSender.propTypes = {
	userId: PropTypes.number.isRequired,
	appId: PropTypes.number.isRequired,
	note: PropTypes.string,
	onComplete: PropTypes.func,
};

export default EmailSender;
