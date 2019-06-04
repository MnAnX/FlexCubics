import Config from '../config';
import { createRequestOptions } from './utils';
import { get } from 'lodash';

export function findUser(email, callback) {
	const options = createRequestOptions({ email });

	fetch(Config.serverUrl + '/FindUserByEmail', options)
		.then((response) => {
			return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error finding user: " + error);
		});
}

export function getUserInfo(userId, callback) {
	const options = createRequestOptions({ userId });

	fetch(Config.serverUrl + '/GetUserInfo', options)
		.then((response) => {
			return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting user info: " + error);
		});
}

export function getUserApps(userId, callback) {
	const options = createRequestOptions({ userId });

	fetch(Config.serverUrl + '/GetUserApps', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting user apps: " + error);
		});
}

export function getAllPublishedApps(callback) {
	const options = createRequestOptions({ });

	fetch(Config.serverUrl + '/GetAllPublishedApps', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting all published apps: " + error);
		});
}

export function getAllNonPublishedApps(callback) {
	const options = createRequestOptions({ });

	fetch(Config.serverUrl + '/GetAllNonPublishedApps', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting all non-published apps: " + error);
		});
}

export function getAllAppCreators(callback) {
	const options = createRequestOptions({ });

	fetch(Config.serverUrl + '/GetAllAppCreators', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting all app creators: " + error);
		});
}

export function publishApp(userId, appId, callback) {
	const options = createRequestOptions({userId, appId});

	fetch(Config.serverUrl + '/PublishApp', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error publishing app: " + error);
		});
}

export function unpublishApp(userId, appId, callback) {
	const options = createRequestOptions({userId, appId});

	fetch(Config.serverUrl + '/UnpublishApp', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error unpublishing app: " + error);
		});
}

export function addAppToUser(userId, appId, callback) {
	const options = createRequestOptions({userId, appId});

	fetch(Config.serverUrl + '/AddAppToUser', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error adding app to user: " + error);
		});
}

export function getAppUserInfo(userId, appId, callback) {
	const options = createRequestOptions({userId, appId});

	fetch(Config.serverUrl + '/GetAppUserInfo', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting app user info: " + error);
		});
}

export function lockApp(userId, appId, isLocked, lockCode, callback) {
	const options = createRequestOptions({userId, appId, isLocked, lockCode});

	fetch(Config.serverUrl + '/LockApp', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error locking app: " + error);
		});
}

export function getNewCustomAppsData(userId, rangeInDays, callback) {
	const options = createRequestOptions({userId, rangeInDays});

	fetch(Config.serverUrl + '/GetNewCustomAppsData', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error getting new custom apps data: " + error);
		});
}

export function createNewOrganization(request, callback) {
	const options = createRequestOptions(request);

	fetch(Config.serverUrl + '/CreateNewOrganization', options)
		.then((response) => {
      return response.json();
    })
		.then((data) => {
      callback(get(data, 'response'));
		})
		.catch((error) => {
			console.error("Error creating new organization: " + error);
		});
}

export function getUserBehaviorData(request, callback) {
	const options = createRequestOptions(request);

	fetch(Config.serverUrl + '/GetUserBehaviorData', options)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			//console.error(data);
			callback(get(data,'response'));
		})
		.catch((error) => {
			console.error("Error getting user behavior data: " + error);
		});
}
