export default {
	serverUrl: 'https://web.advicecoachserver.com',
	//serverUrl: 'http://localhost:3001',
	mobileServerUrl: 'https://mobile.advicecoachserver.com',
	//mobileServerUrl: 'http://localhost:8080',
	commServerUrl: 'https://comm.advicecoachserver.com',
	auth0: {
		domain: 'advicecoach.auth0.com',
		clientID: 'XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND',
	},
	cloudinary: {
		cloudName: 'advicecoach',
		apiKey: '587244823128573',
		apiSecret: 'HuSrrEY1WLTIzNqnuutLgKrYNG4',
	},
	s3: {
		bucket: "app-image-storage",
    region: 'us-west-2',
		s3Url: 'https://app-image-storage.s3.amazonaws.com'
	},
	keen: {
		projectId: "58f19ddf54532cb1704d4b6d",
		readKey: "E7D165210C02FC42A94BAB42FC63E4736CC098E8127431E08B86407223C64BF0FBC667CCA03C09C9A93D2E310E1B23C607F5BFF4989C56B968665AE89AEF57A6DB334A5BF6308219EE879D9CF8E6D51A2E90038A1CAF1494153F249B67423A9B",
		writeKey: "53B0F6D88FAF99927F8F039310AB843DA38E52F9292044A549CC315AFA6D6686C316DCB2FDE6E100C57930CCF080D39597A131477B5DE6CCC9C6586A91528CCBD686FC292A48A5DEFD6D372F7E564813999487044CC255F0954E110707553887"
	},
	system: {
		mobileScreenWidthThreshold: 500,
		freeTrailDays: 60,
	},
};
