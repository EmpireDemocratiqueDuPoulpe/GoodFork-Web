import config from "../config/config.js";

/*****************************************************
 * API
 *****************************************************/

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

export function sendFiles(destination, files) {
	const formData = new FormData();

	Object.entries(files).forEach(([key, file]) => {
		formData.append(key, file);
	});

	const options = {
		method: destination.method,
		headers: api.headers,
		body: formData
	};

	return new Promise(((resolve, reject) => {
		fetch(destination.uri, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/*****************************************************
 * Date
 *****************************************************/

export function convertDate(d) {
	return (
		d === null ? d :
			d === undefined ? d :
				d.constructor === Date ? d :
					d.constructor === Array ? new Date(d[0],d[1],d[2]) :
						d.constructor === Number ? new Date(d) :
							d.constructor === String ? new Date(d) :
								typeof d === "object" ? new Date(d.year,d.month,d.date) :
									NaN
	);
}

export function dateForDisplay(d) {
	const date = convertDate(d);
	return date ? (date.constructor === Date ? date.toLocaleDateString("fr-FR") : null) : null;
}

export function dateForField(d) {
	const date = convertDate(d);
	if (!date) return null;

	const offset = date.getTimezoneOffset();
	return new Date(date.getTime() - (offset * 60 * 1000)).toISOString().slice(0, -14);
}