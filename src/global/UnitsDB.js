import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.units.getAll);
}

async function getAllAsSelect() {
	return new Promise(((resolve, reject) => {
		getAll()
			.then(response => {
				const unitsAsSelect = [];

				response.units.forEach(unit => {
					unitsAsSelect.push({ value: unit.unit_id, text: unit.name });
				});

				resolve(unitsAsSelect);
			})
			.catch(err => reject(err));
	}));
}

/* ---- EXPORT ---------------------------------- */
const UnitsDB = { getAll, getAllAsSelect };
export default UnitsDB;