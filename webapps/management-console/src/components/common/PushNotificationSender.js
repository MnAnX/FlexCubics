import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NormalTextField from '../common/NormalTextField';
import NormalBigButton from '../common/NormalBigButton';

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

class PushNotificationSender extends Component {
	constructor(props) {
    super(props);

    this.state = {
			subject: props.subject,
			text: props.text,
    }

		this.send=this.send.bind(this);
		this.sendToUser=this.sendToUser.bind(this);
		this.sendToApp=this.sendToApp.bind(this);
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
			case 'app':
				this.sendToApp();
				break;
			default:
				this.sendToUser();
		}
	}

	sendToUser() {
		const options = createRequestOptions({
			userId: this.props.userId,
			appId: this.props.appId,
			appUserId: this.props.recipientUserId,
			subject: this.state.subject,
			text: this.state.text,
		});

		fetch(Config.serverUrl + '/SendPushNotificationToUser', options)
			.then((response) => {console.log("Send notification to user response: ", response.json())})
			.catch((error) => {
				console.error("Error sending notification to user: " + error);
			});
	}

	sendToApp() {
		const options = createRequestOptions({
			userId: this.props.userId,
			appId: this.props.appId,
			subject: this.state.subject,
			text: this.state.text,
		});

		fetch(Config.serverUrl + '/SendPushNotificationToApp', options)
			.then((response) => {console.log("Send notification to app response: ", response.json())})
			.catch((error) => {
				console.error("Error sending notification to app: " + error);
			});
	}

  render() {
    return (
			<div>
				<div style={style.container}>
					<NormalTextField
						floatingLabelText="Subject"
						errorText={_.isEmpty(this.state.subject) ? "This field is required" : ""}
						value={this.state.subject}
						onChange={(event)=>{this.setState({subject: event.target.value})}}
					/>
					<NormalTextField
						floatingLabelText="Text"
						multiLine={true}
            rows={10}
            rowsMax={20}
						value={this.state.text}
						onChange={(event)=>{this.setState({text: event.target.value})}}
					/>
				</div>
				<div style={style.buttons}>
					<NormalBigButton label="Cancel" onClick={()=>this.props.onComplete()} />
					<NormalBigButton label="Send"
						onClick={()=>{
							this.send();
							this.props.onComplete();
						}}
					/>
				</div>
			</div>
    );
	}
}

PushNotificationSender.propTypes = {
	type: PropTypes.string.isRequired,
	userId: PropTypes.number.isRequired,
	appId: PropTypes.number.isRequired,
	recipientUserId: PropTypes.number,
	subject: PropTypes.string,
	text: PropTypes.string,
	onComplete: PropTypes.func,
};

export default PushNotificationSender;
