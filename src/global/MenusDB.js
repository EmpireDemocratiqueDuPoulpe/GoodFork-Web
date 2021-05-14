import { sendQuery } from "./AllDB.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.menus.getAll);
}

async function getById(menu_id) {
	return sendQuery(api.menus.getById, null, null, menu_id);
}

/* ---- EXPORT ---------------------------------- */
const MenusDB = { getAll, getById };
export default MenusDB;