import config from "../config/config.js";

const { api } = config;

export function sendQuery(destination, headers = null, body = null) {
	const options = {
		method: destination.method,
		headers: headers ? { ...headers, ...api.headers  } : api.headers
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	return new Promise(((resolve, reject) => {
		fetch(destination.uri, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}