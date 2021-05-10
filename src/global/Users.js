import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function addStaff(member) {
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(member)
	};

	return new Promise(((resolve, reject) => {
		fetch(api.staff.add, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- READ ------------------------------------ */
async function getStaff() {
	const options = {
		method: "get",
		headers: { Accept: "application/json" }
	};

	return new Promise(((resolve, reject) => {
		fetch(api.staff.getAll, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- UPDATE ---------------------------------- */
async function update(user) {
	const options = {
		method: "put",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			user_id: user.user_id,
			first_name: user.firstName,
			last_name: user.lastName,
			email: user.email,
		})
	};

	return new Promise(((resolve, reject) => {
		fetch(api.users.update, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- DELETE ---------------------------------- */
async function deleteStaff(member) {
	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ user_id: member.user_id })
	};

	return new Promise(((resolve, reject) => {
		fetch(api.staff.delete, options)
			.then(response => resolve(response.json()))
			.catch(err => reject(err));
	}));
}

/* ---- EXPORT ---------------------------------- */
const Users = { addStaff, getStaff, update, deleteStaff };
export default Users;