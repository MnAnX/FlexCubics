export default {
  env: 'prd',
  //env: 'prd',
  appVersion: 1.22,
  serverUrl: 'https://mobile.advicecoachserver.com',
  //serverUrl: 'http://localhost:8080',
  webServerUrl: 'https://web.advicecoachserver.com',
  //webServerUrl: 'http://localhost:3001',
  commServerUrl: 'https://comm.advicecoachserver.com',
  //commServerUrl: 'http://localhost:3003',
  auth0: {
  	clientId: 'XYUfgxnGgzGVO4ENh8q1YLwXbFAYJ0ND',
  	domainName: 'advicecoach.auth0.com',
    audience: 'https://advicecoach.auth0.com/userinfo'
  },
  s3: {
    region: 'us-west-2',
    accessKey: 'AKIAIPUVYOHGPVGYBDLA',
    secretKey: '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',
    userImageBucket: 'user-image-storage'
  },
  keen: {
    projectId: '58f19ddf54532cb1704d4b6d',
    key: '2B05972ACC2993A296875D733BE8374678D1A7815C1D8E9886357E9AFB031368',
  },
  onesignal: {
    appId: 'e0ed93e9-2c4e-4dcd-8164-01e2be5cfaab'
  }
};
