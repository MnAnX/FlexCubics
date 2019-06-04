import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NormalTextField from '../common/NormalTextField';
import NormalBigButton from '../common/NormalBigButton';
import ActionButton from '../common/ActionButton';
import Checkbox from 'material-ui/Checkbox';

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
		var defaultAllowReply = false;
		if (this.props.type === 'user'){
			defaultAllowReply = true;
		}
    this.state = {
			subject: props.subject,
			text: props.text,
			allowReply: defaultAllowReply,
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

	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

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
			//appId: this.props.appId,
			//appUserId: this.props.recipientUserId,
			recipientUserId: this.props.recipientUserId,
			sender: this.props.sender,
			allowReply: this.state.allowReply,
			subject: this.state.subject,
			text: this.state.text,
		});
		/*
		fetch(Config.serverUrl + '/SendPushNotificationToUser', options)
			.then((response) => {console.log("Send notification to user response: ", response.json())})
			.catch((error) => {
				console.error("Error sending notification to user: " + error);
			});
		*/
		fetch(Config.commServerUrl + '/SendNotificationToUser', options)
			.then((response) => {console.log("Send notification to user response: ", response.json())})
			.catch((error) => {
				console.error("Error sending notification to user: " + error);
			});
	}

	sendToApp() {
		const options = createRequestOptions({
			userId: this.props.userId,
			appId: this.props.appId,
			sender: this.props.sender,
			allowReply: this.state.allowReply,
			subject: this.state.subject,
			text: this.state.text,
		});
		/*
		fetch(Config.serverUrl + '/SendPushNotificationToApp', options)
			.then((response) => {console.log("Send notification to app response: ", response.json())})
			.catch((error) => {
				console.error("Error sending notification to app: " + error);
			});
		*/
		fetch(Config.commServerUrl + '/SendNotificationToApp', options)
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
					<Checkbox
						label="Allow Reply"
						checked={this.state.allowReply}
						onCheck={this.handleChange("allowReply")}
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
			</div>
    );
	}
}

PushNotificationSender.propTypes = {
	type: PropTypes.string.isRequired,
	userId: PropTypes.number.isRequired,
	appId: PropTypes.number,
	recipientUserId: PropTypes.number,
	subject: PropTypes.string,
	text: PropTypes.string,
	onComplete: PropTypes.func,
};

export default PushNotificationSender;
