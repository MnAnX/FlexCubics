export const createRequestOptions = body => {
	let formData = new FormData();

	formData.append('req', JSON.stringify(body));

	let options = {
		headers: {},
		method: 'post'
	};
	options.body = formData;

	return options;
};