import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'
import Home from './Home';

import { connect } from 'react-redux';
import { userLogin } from '../actions/user';

class App extends Component {
	constructor(props) {
    super(props);
    this.state = {
      profile: {},
      user: {}
    };
  }

  componentWillMount() {
    const {
			isAuthenticated,
			login,
			logout,
      getProfile
    } = this.props.auth;

    if (isAuthenticated()) {
      getProfile((err, profile) => {
				let userEmail = profile.email;
				if(isEmpty(profile.email)) {
					userEmail = profile.user_id;
				}
        this.setState({
          profile,
          user: {
            email: userEmail,
          }
        });
      });
    } else {
			login();
		}
  }

	render() {
		if (this.props.auth.isAuthenticated() && !isEmpty(this.state.user)) {
      this.props.userLogin(this.state.user, this.state.profile);
    };
		return (
			<Home auth={this.props.auth}/>
		);
	}
}

function mapStateToProps({user}) {
	return {
		userId: user.userId,
		userProfile: user.profile,
	}
}

const mapDispatchToProps = dispatch => ({
	userLogin: (user, profile) => {
		dispatch(userLogin(user, profile));
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
