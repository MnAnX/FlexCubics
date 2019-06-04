import Config from '../config';
import _ from 'lodash';

export function signIn(email, password, callback, failCallback) {
	fetch('https://advicecoach.auth0.com/oauth/token', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
			grant_type: "password",
		  username: email,
		  password,
		  scope: "openid profile email",
		  client_id: "XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND",
	  })
	})
	.then((response) => response.json())
	.then((ret) => {
		callback(ret);
	})
	.catch((error) => {
		console.error("Error signing up with Auth0: " + error);
		failCallback(error)
	});
}

export function getUserProfile(accessToken, callback, failCallback) {
	let auth = `Bearer ${accessToken}`
	fetch('https://advicecoach.auth0.com/userinfo', {
	  method: 'GET',
	  headers: {
			'Authorization': auth,
	  }
	})
	.then((response) => response.json())
	.then((ret) => {
		callback(ret);
	})
	.catch((error) => {
		console.error("Error getting user profile: " + error);
		failCallback(error)
	});
}

export function signUp(email, password, firstName, lastName, callback, failCallback) {
	fetch('https://advicecoach.auth0.com/dbconnections/signup', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
			client_id: "XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND",
		  email,
		  password,
		  connection: "Username-Password-Authentication",
		  user_metadata: { given_name: firstName, family_name: lastName }
	  })
	})
	.then((response) => response.json())
	.then((ret) => {
		callback(ret);
	})
	.catch((error) => {
		console.error("Error signing up with Auth0: " + error);
		failCallback(error)
	});
}

export function changePassword(email, callback, failCallback) {
	fetch('https://advicecoach.auth0.com/dbconnections/change_password', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
			client_id: "XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND",
		  email,
		  connection: "Username-Password-Authentication",
	  })
	})
	.then((ret) => {
		callback(ret);
	})
	.catch((error) => {
		console.error("Error changing password with Auth0: " + error);
		failCallback(error)
	});
}
