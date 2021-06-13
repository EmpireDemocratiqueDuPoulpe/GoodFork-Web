import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- READ ------------------------------------ */
async function getWeeklySales(toChartData = true) {
	const data = await sendQuery(api.stats.sales.week);

	return data.error
		? data
		: toChartData ? toSingleChartData(data, "stats", "day", "benefits", "Bénéfice") : data;
}

async function getWeeklyStock(toChartData = true) {
	const data = await sendQuery(api.stats.stock.week);

	return data.error
		? data
		: toChartData ? toMultipleChartData(data, "stats", "day", "units", "name") : data;
}

async function getWeeklyMenus(toChartData = true) {
	const data = await sendQuery(api.stats.menus.week);

	return data.error
		? data
		: toChartData ? toMultipleChartData(data, "stats", "day", "count", "name") : data;
}

function toSingleChartData(response, responseProp, xProp, yProp, id = "single") {
	if (response.error) return response;

	const result = response;
	const data = [];

	response[responseProp].forEach(d => {
		data.push({ x: d[xProp], y: d[yProp] });
	});

	result[responseProp] = [{ id: id, data: data }];

	return result;
}

function toMultipleChartData(response, responseProp, xProp, yProp, idProp) {
	if (response.error) return response;

	const result = response;
	const data = new Map();

	response[responseProp].forEach(d => {
		const item = data.has(d[idProp])
			? data.get(d[idProp])
			: { id: d[idProp], data: [] };

		item.data.push({ x: d[xProp], y: d[yProp] });
		data.set(d[idProp], item);
	});

	result[responseProp] = [...data.values()];

	return result;
}

/* ---- EXPORT ---------------------------------- */
const StatisticsDB = {
	sales: { getWeekly: getWeeklySales },
	stock: { getWeekly: getWeeklyStock },
	menus: { getWeekly: getWeeklyMenus }
};
export default StatisticsDB;