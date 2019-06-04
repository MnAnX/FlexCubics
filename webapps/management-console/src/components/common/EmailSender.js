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

class EmailSender extends Component {
	constructor(props) {
    super(props);

    this.state = {
			subject: props.subject,
			text: props.text,
    }

		this.sendEmail=this.sendEmail.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({
			subject: nextProps.subject,
			text: nextProps.text,
		})
	}

	sendEmail() {
		const options = createRequestOptions({
			userId: this.props.userId,
			recipient: this.props.recipient,
			sender: this.props.sender,
			subject: this.state.subject,
			text: this.state.text,
		});

		fetch(Config.serverUrl + '/SendEmail', options)
			.then((response) => {console.log("Send email response: ", response.json())})
			.catch((error) => {
				console.error("Error sending email: " + error);
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
							this.sendEmail();
							this.props.onComplete();
						}}
					/>
				</div>
			</div>
    );
	}
}

EmailSender.propTypes = {
	userId: PropTypes.number.isRequired,
	recipient: PropTypes.string.isRequired,
	sender: PropTypes.string,
	subject: PropTypes.string,
	text: PropTypes.string,
	onComplete: PropTypes.func,
};

export default EmailSender;
