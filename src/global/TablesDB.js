import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function add(table) {
	return sendQuery(api.tables.add, { "Content-Type": "application/json" }, {
		name: table.name,
		capacity: table.capacity,
		is_available: table.is_available,
		can_be_used: table.can_be_used
	});
}

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.tables.getAll);
}

/* ---- UPDATE ---------------------------------- */
async function update(table) {
	return sendQuery(api.tables.update, {"Content-Type": "application/json"}, {
		table_id: table.table_id,
		name: table.name,
		capacity: table.capacity,
		is_available: table.is_available,
		can_be_used: table.can_be_used
	});
}

/* ---- DELETE ---------------------------------- */
async function del(table) {
	return sendQuery(api.tables.delete, { "Content-Type": "application/json" }, {
		table_id: table.table_id
	});
}

/* ---- EXPORT ---------------------------------- */
const TablesDB = { add, getAll, update, delete: del };
export default TablesDB;