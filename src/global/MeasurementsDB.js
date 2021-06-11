import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getAllByTypes(forStock = false) {
	return sendQuery(forStock ? api.measurements.getAllByTypesForStock : api.measurements.getAllByTypes);
}

async function convert(value, from, to) {
	return sendQuery(api.measurements.convert, { "Content-Type": "application/json" }, {
		value: value,
		from: from,
		to: to
	});
}

/* ---- EXPORT ---------------------------------- */
const MeasurementsDB = { getAllByTypes, convert };
export default MeasurementsDB;