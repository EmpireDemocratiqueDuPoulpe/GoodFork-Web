import { sendQuery } from "./Functions.js";
import config from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function addIngredient(menu, ingredient) {
	console.log(ingredient);
	return sendQuery(api.ingredients.add, { "Content-Type": "application/json" }, {
		menu_id: menu.menu_id,
		name: ingredient.name,
		units: ingredient.units,
		units_unit_id: ingredient.units_unit_id
	});
}

/* ---- READ ------------------------------------ */
async function getAll() {
	return sendQuery(api.menus.getAll);
}

async function getById(menu_id) {
	return sendQuery(api.menus.getById, null, null, menu_id);
}

/* ---- UPDATE ---------------------------------- */
async function updateIngredient(ingredient) {
	return sendQuery(api.ingredients.update, { "Content-Type": "application/json" }, {
		ingredient_id: ingredient.ingredient_id,
		name: ingredient.name,
		units: ingredient.units,
		units_unit_id: ingredient.units_unit_id
	});
}

/* ---- DELETE ---------------------------------- */
async function delIngredient(ingredient) {
	return sendQuery(api.ingredients.delete, { "Content-Type": "application/json" }, {
		ingredient_id: ingredient.ingredient_id
	});
}

/* ---- EXPORT ---------------------------------- */
const MenusDB = { addIngredient, getAll, getById, updateIngredient, deleteIngredient: delIngredient };
export default MenusDB;