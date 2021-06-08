import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getAllByTypes(forStock = false) {
	return sendQuery(forStock ? api.measurements.getAllByTypesForStock : api.measurements.getAllByTypes);
}

/* ---- EXPORT ---------------------------------- */
const MeasurementsDB = { getAllByTypes };
export default MeasurementsDB;