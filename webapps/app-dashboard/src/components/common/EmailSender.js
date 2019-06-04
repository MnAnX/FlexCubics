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
			subject: props.subject,
			text: props.text,
    }

		this.send = this.send.bind(this);
		this.sendToUser = this.sendToUser.bind(this);
		this.sendToOrg = this.sendToOrg.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({
			subject: nextProps.subject,
			text: nextProps.text,
		})
	}

	send() {
		switch (this.props.type) {
			case 'user':
				this.sendToUser();
				break;
			case 'org':
				this.sendToOrg();
				break;
			default:
				this.sendToUser();
		}
	}

	sendToUser() {
		this.setState({isLoading: true})

		const options = createRequestOptions({
			userId: this.props.userId,
			recipient: this.props.recipient,
			sender: this.props.sender,
			subject: this.state.subject,
			text: this.state.text,
		});

		fetch(Config.serverUrl + '/SendEmail', options)
			.then((response) => {
				console.log("Send email response: ", response.json())
				this.setState({isLoading: false})
			})
			.catch((error) => {
				console.error("Error sending email: " + error);
			});
	}

	sendToOrg() {
		this.setState({isLoading: true})

		const options = createRequestOptions({
			userId: this.props.userId,
			orgId: this.props.orgId,
			subject: this.state.subject,
			text: this.state.text,
		});

		fetch(Config.serverUrl + '/SendEmailToAllOrgMembers', options)
			.then((response) => {
				console.log("Send email response: ", response.json())
				this.setState({isLoading: false})
			})
			.catch((error) => {
				console.error("Error sending email: " + error);
			});
	}

  render() {
    return (
			<div>
			<Loader show={this.state.isLoading} message={'Sending email...'}>
				<div style={style.container}>
					<NormalTextField
						floatingLabelText="Subject"
						fullWidth={true}
						errorText={_.isEmpty(this.state.subject) ? "This field is required" : ""}
						value={this.state.subject}
						onChange={(event)=>{this.setState({subject: event.target.value})}}
					/>
					<NormalTextField
						floatingLabelText="Text"
						fullWidth={true}
						multiLine={true}
            rows={10}
            rowsMax={20}
						value={this.state.text}
						onChange={(event)=>{this.setState({text: event.target.value})}}
					/>
				</div>
				<div style={style.buttons}>
					<NormalBigButton label="Cancel" onClick={()=>this.props.onComplete()} />
					<ActionButton label="Send"
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
	type: PropTypes.string.isRequired,
	userId: PropTypes.number.isRequired,
	orgId: PropTypes.number,
	recipient: PropTypes.string,
	sender: PropTypes.string,
	subject: PropTypes.string,
	text: PropTypes.string,
	onComplete: PropTypes.func,
};

export default EmailSender;
