import history from '../../history';
import auth0 from 'auth0-js';

import Config from '../../config';

export default class Auth {

	constructor() {
		this.auth0 = new auth0.WebAuth({
			domain: Config.auth0.domain,
			clientID: Config.auth0.clientID,
			redirectUri: Config.auth0.redirectUri,
			audience: Config.auth0.audience,
			responseType: 'token id_token',
			scope: 'openid profile email'
		});

		this.userProfile;
		this.login = this.login.bind(this);
		this.signup = this.signup.bind(this);
		this.logout = this.logout.bind(this);
		this.handleAuthentication = this.handleAuthentication.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
		this.getAccessToken = this.getAccessToken.bind(this);
		this.getProfile = this.getProfile.bind(this);
	}

	login() {
		this.auth0 = new auth0.WebAuth({
			domain: Config.auth0.domain,
			clientID: Config.auth0.clientID,
			redirectUri: Config.auth0.redirectUri,
			audience: Config.auth0.audience,
			responseType: 'token id_token',
			scope: 'openid profile email'
		});
		this.auth0.authorize();
	}

	signup() {
		this.auth0 = new auth0.WebAuth({
			domain: Config.auth0.domain,
			clientID: Config.auth0.clientID,
			redirectUri: Config.auth0.redirectUri + "#signup",
			audience: Config.auth0.audience,
			responseType: 'token id_token',
			scope: 'openid profile email'
		});
		this.auth0.authorize();
	}

	handleAuthentication() {
		this.auth0.parseHash(window.location.hash, (err, authResult) => {
			console.log(authResult, err);
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.setSession(authResult);
				//history.replace('/');
			} else if (err) {
				//history.replace('/');
				console.log(err);
				alert(`Error: ${err.error}. Please try to open AdviceCoach in another browser window.`);
			}
		});
	}

	setSession(authResult) {
		// Set the time that the access token will expire at
		let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
		localStorage.setItem('expires_at', expiresAt);
		// navigate to the home route
		//history.replace('/');
	}

	getAccessToken() {
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		return accessToken;
	}

	getProfile(cb) {
		let accessToken = this.getAccessToken();
		this.auth0.client.userInfo(accessToken, (err, profile) => {
			if (profile) {
				this.userProfile = profile;
			}
			cb(err, profile);
		});
	}

	logout() {
		// Clear access token and ID token from local storage
		localStorage.removeItem('access_token');
		localStorage.removeItem('id_token');
		localStorage.removeItem('expires_at');
		// navigate to the home route
		history.replace(Config.homepage);
	}

	isAuthenticated() {
		// Check whether the current time is past the
		// access token's expiry time
		let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
		return new Date().getTime() < expiresAt;
	}
}
