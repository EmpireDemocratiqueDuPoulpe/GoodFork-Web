import config from "../config/config.js";

const { api } = config;
/* ---- READ ------------------------------------ */
async function getStaff() {
	const options = {
		method: "get",
		headers: { Accept: "application/json" }
	};

	const response = await fetch(api.staff.getAll, options);
	return await response.json();
}

/* ---- DELETE ---------------------------------- */
async function deleteStaff(member) {
	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ userId: member.user_id })
	};

	const response = await fetch(api.staff.delete, options);
	return await response.json();
}

/* ---- EXPORT ---------------------------------- */

const Users = { getStaff, deleteStaff };
export default Users;