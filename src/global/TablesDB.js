import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function add(table) {
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(table)
	};

	return new Promise(((resolve, reject) => {
		fetch(api.tables.add, options)
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
		fetch(api.tables.getAll, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- UPDATE ---------------------------------- */
async function update(table) {
	const options = {
		method: "put",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(table)
	};

	return new Promise(((resolve, reject) => {
		fetch(api.tables.update, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- DELETE ---------------------------------- */
async function del(table) {
	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ table_id: table.table_id })
	};

	return new Promise(((resolve, reject) => {
		fetch(api.tables.delete, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- EXPORT ---------------------------------- */
const TablesDB = { add, getAll, update, delete: del };
export default TablesDB;