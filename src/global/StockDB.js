import { sendQuery } from "./AllDB.js";
import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function add(item) {
	return sendQuery(api.stock.add, { "Content-Type": "application/json" }, {
		name: item.name,
		units: item.units,
		unit_price: item.unit_price,
		is_orderable: item.is_orderable,
		is_cookable: item.is_cookable,
		use_by_date_min: item.use_by_date_min,
		use_by_date_max: item.use_by_date_max
	});
}

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.stock.getAll);
}

/* ---- UPDATE ---------------------------------- */
async function update(item) {
	return sendQuery(api.stock.update, { "Content-Type": "application/json" }, {
		stock_id: item.stock_id,
		name: item.name,
		units: item.units,
		unit_price: item.unit_price,
		is_orderable: item.is_orderable,
		is_cookable: item.is_cookable,
		use_by_date_min: item.use_by_date_min,
		use_by_date_max: item.use_by_date_max
	});
}

/* ---- DELETE ---------------------------------- */
async function del(item) {
	return sendQuery(api.stock.delete, { "Content-Type": "application/json" }, {
		stock_id: item.stock_id
	});
}

/* ---- EXPORT ---------------------------------- */
const StockDB = { add, getAll, update, delete: del };
export default StockDB;