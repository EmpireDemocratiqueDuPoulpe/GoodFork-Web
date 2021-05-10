import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function add(item) {
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(item)
	};

	return new Promise(((resolve, reject) => {
		fetch(api.stock.add, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- READ ------------------------------------ */
async function getAll() {
	const options = {
		method: "get",
		headers: { Accept: "application/json" }
	};

	return new Promise(((resolve, reject) => {
		fetch(api.stock.getAll, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- UPDATE ---------------------------------- */
async function update(item) {
	const options = {
		method: "put",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(item)
	};

	return new Promise(((resolve, reject) => {
		fetch(api.stock.update, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- DELETE ---------------------------------- */
async function del(item) {
	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ stock_id: item.stock_id })
	};

	return new Promise(((resolve, reject) => {
		fetch(api.stock.delete, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- EXPORT ---------------------------------- */
const Stock = { add, getAll, update, delete: del };
export default Stock;