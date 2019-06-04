//const homepage = 'https://advicecoach-management-console.s3-us-west-2.amazonaws.com/index.html';
const homepage = 'http://localhost:3000';

export default {
	//serverUrl: 'https://report.advicecoachserver.com',
	serverUrl: 'http://localhost:3002',
	mobileServerUrl: 'https://mobile.advicecoachserver.com',
	auth0: {
		domain: 'advicecoach.auth0.com',
		clientID: 'XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND',
		audience: 'https://advicecoach.auth0.com/userinfo',
		redirectUri: homepage,
	},
	s3: {
		bucket: "app-image-storage",
    region: 'us-west-2',
		s3Url: 'https://app-image-storage.s3.amazonaws.com'
	},
	keen: {
		projectId: "58f19ddf54532cb1704d4b6d",
		readKey: "E7D165210C02FC42A94BAB42FC63E4736CC098E8127431E08B86407223C64BF0FBC667CCA03C09C9A93D2E310E1B23C607F5BFF4989C56B968665AE89AEF57A6DB334A5BF6308219EE879D9CF8E6D51A2E90038A1CAF1494153F249B67423A9B"
	},
};
