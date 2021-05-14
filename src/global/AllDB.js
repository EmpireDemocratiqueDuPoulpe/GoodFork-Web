import config from "../config/config.js";

const { api } = config;

export function sendQuery(destination, headers = null, body = null, params = null) {
	const options = {
		method: destination.method,
		headers: headers ? { ...headers, ...api.headers  } : api.headers
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	const uri = params ? `${destination.uri}/${params}` : destination.uri;

	return new Promise(((resolve, reject) => {
		fetch(uri, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}