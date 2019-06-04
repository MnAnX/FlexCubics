import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/apps';

import _ from 'lodash'

import ActionButton from '../components/common/ActionButton';
import NavBar from '../components/common/NavBar';

import layoutStyle from '../styles/layout'

class SelectPlaybook extends Component {
	constructor(props) {
    super(props);
  }

	componentWillMount() {
    if(this.props.apps.appInfos.length < 1) {
      this.props.getUserApps(this.props.userId);
    }
  }

	render() {
		var appList = _.values(this.props.apps.appInfos)
		const listItems = appList.map((appInfo) =>
		  <ActionButton label={appInfo.author} component={Link} to={`/check-in/${appInfo.appId}`} />
		);

		return (
			<div>
				<NavBar goBack='/start' />
				<div style={layoutStyle.container}>
					Please Choose Your Therapist Below By Clicking on the Name:
	        <br /><br /><br />
					{listItems}
				</div>
			</div>
		);
	}
}

function mapStateToProps({user, apps}) {
	return {
		userId: user.userId,
		apps,
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPlaybook);
