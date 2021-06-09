import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.roles.getAll);
}

async function getAllAsSelect() {
	return new Promise(((resolve, reject) => {
		getAll()
			.then(response => {
				const rolesAsSelect = [];

				response.roles.forEach(role => {
					rolesAsSelect.push({ value: role.role_id, text: role.display_name ?? role.name });
				});

				resolve(rolesAsSelect);
			})
			.catch(err => reject(err));
	}));
}

/* ---- EXPORT ---------------------------------- */
const RolesDB = { getAll, getAllAsSelect };
export default RolesDB;