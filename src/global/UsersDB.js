import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { auth, api } = config;

/* ---- CREATE ---------------------------------- */
async function addStaff(member) {
	return sendQuery(api.staff.add, { "Content-Type": "application/json" }, {
		role_id: member.role_id,
		first_name: member.first_name,
		last_name: member.last_name,
		email: member.email
	});
}

/* ---- READ ------------------------------------ */
async function logIn(email, password) {
	return sendQuery(api.users.logIn, { "Content-Type": "application/json" }, {
		email: email,
		password: password,
		roleLevel: auth.roleLevel
	});
}

async function logInWithToken(token) {
	return sendQuery(api.users.logInToken, { "Content-Type": "application/json" }, {
		token: token,
		roleLevel: auth.roleLevel
	});
}

async function getStaff() {
	return sendQuery(api.staff.getAll);
}

/* ---- UPDATE ---------------------------------- */
async function update(user) {
	return sendQuery(api.users.update, { "Content-Type": "application/json" }, {
		user_id: user.user_id,
		role_id: user.role_id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email
	});
}

/* ---- DELETE ---------------------------------- */
async function deleteStaff(member) {
	return sendQuery(api.staff.delete, { "Content-Type": "application/json" }, {
		user_id: member.user_id
	});
}

/* ---- EXPORT ---------------------------------- */
const UsersDB = { addStaff, logIn, logInWithToken, getStaff, update, deleteStaff };
export default UsersDB;