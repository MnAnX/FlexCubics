import Config from '../config';
import { createRequestOptions } from './utils';
import _ from 'lodash';

export function getAwsSignedUrl(userId, fileName, file, callback, failCallback) {
	let bucketName = Config.s3.bucket;
	let objectKey = fileName;
	let contentType = file.type;
	const options = createRequestOptions({ userId, bucketName, objectKey, contentType });
	fetch(Config.serverUrl + '/GetS3SignedUrl', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			let signedUrl = _.replace(ret.signedUrl, "http://", "https://");
			let result = {
				signedUrl,
				fileName,
				publicUrl: '/s3/uploads/' + fileName,
				fileKey: fileName,
			}
			callback(result);
		})
		.catch((error) => {
			console.error("Error getting signed url: " + error);
			failCallback();
		});
}

export function submitSubscription(userId, appId, token, planId, planName, callback) {
	const options = createRequestOptions({ userId, appId, token, planId, planName });
	fetch(Config.serverUrl + '/SubmitSubscription', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			callback(ret);
		})
		.catch((error) => {
			console.error("Error submitting subscription: " + error);
		});
}

export function getOrganizationMemberApps(userId, callback) {
	const options = createRequestOptions({ userId });
	fetch(Config.serverUrl + '/GetUserApps', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			callback(ret);
		})
		.catch((error) => {
			console.error("Error getting organization member apps: " + error);
		});
}

export function getAppInfo(userId, appId, callback) {
	const options = createRequestOptions({ userId, appId });
	fetch(Config.serverUrl + '/GetAppInfo', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			callback(ret);
		})
		.catch((error) => {
			console.error("Error getting app info: " + error);
		});
}

export function getAppUsers(userId, appId, callback) {
	const options = createRequestOptions({ userId, appId });
	fetch(Config.serverUrl + '/GetAppUsers', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			callback(ret);
		})
		.catch((error) => {
			console.error("Error getting app users: " + error);
		});
}

export function addMemberToOrganization(userId, orgId, memberName, memberEmail, callback) {
	const options = createRequestOptions({ userId, orgId, memberName, memberEmail });
	fetch(Config.serverUrl + '/AddMemberToOrganization', options)
		.then((response) => response.json())
		.then((responseJson) => {
			let ret =  _.get(responseJson, 'response');
			callback(ret);
		})
		.catch((error) => {
			console.error("Error adding member to organization: " + error);
		});
}
