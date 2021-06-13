import { sendQuery, sendFiles } from "./Functions.js";
import config, { API_FILES_URI } from "../config/config.js";

const { api } = config;

/* ---- CREATE ---------------------------------- */
async function add(menu) {
	return sendQuery(api.menus.add, { "Content-Type": "application/json" }, {
		type: menu.type,
		name: menu.name,
		description: menu.description,
		price: menu.price
	});
}

async function uploadIllustration(menu, image) {
	return sendFiles(api.menus.uploadIllustration, {
		menu_id: menu.menu_id,
		illustration: image
	});
}

async function addIngredient(menu, ingredient) {
	return sendQuery(api.ingredients.add, { "Content-Type": "application/json" }, {
		menu_id: menu.menu_id,
		name: ingredient.name,
		units: ingredient.units,
		units_unit_id: ingredient.units_unit_id
	});
}

/* ---- READ ------------------------------------ */
async function getAll(orderedByType = false) {
	return sendQuery(orderedByType ? api.menus.getAllOrderedByType : api.menus.getAll);
}

async function getAllNames() {
	return sendQuery(api.menus.getAllNames);
}

async function getById(menu_id) {
	return sendQuery(api.menus.getById, null, null, menu_id);
}

async function getTypes() {
	return sendQuery(api.menuTypes.getAll);
}

async function getTypesAsSelect() {
	return new Promise(((resolve, reject) => {
		getTypes()
			.then(response => {
				const typesAsSelect = [];

				response.types.forEach(type => {
					typesAsSelect.push({ value: type.type_id, text: type.name });
				});

				resolve(typesAsSelect);
			})
			.catch(err => reject(err));
	}));
}

/* ---- UPDATE ---------------------------------- */
async function update(menu) {
	return sendQuery(api.menus.update, { "Content-Type": "application/json" }, {
		menu_id: menu.menu_id,
		type_id: menu.type_id,
		name: menu.name,
		description: menu.description,
		price: menu.price
	});
}

async function updateIngredient(ingredient) {
	return sendQuery(api.ingredients.update, { "Content-Type": "application/json" }, {
		ingredient_id: ingredient.ingredient_id,
		name: ingredient.name,
		units: ingredient.units,
		units_unit_id: ingredient.units_unit_id
	});
}

/* ---- DELETE ---------------------------------- */
async function del(menu) {
	return sendQuery(api.menus.delete, { "Content-Type": "application/json" }, {
		menu_id: menu.menu_id
	});
}

async function delIngredient(ingredient) {
	return sendQuery(api.ingredients.delete, { "Content-Type": "application/json" }, {
		ingredient_id: ingredient.ingredient_id
	});
}

/* ---- Menu illustration ----------------------- */
function buildIllustrationURI(uri) {
	return uri
		? uri.startsWith("http") ? uri : `${API_FILES_URI}/${uri}`
		: null;
}

/* ---- EXPORT ---------------------------------- */
const MenusDB = {
	add,
	uploadIllustration,
	addIngredient,
	getAll,
	getAllNames,
	getById,
	getTypes,
	getTypesAsSelect,
	update,
	updateIngredient,
	delete: del,
	deleteIngredient: delIngredient,
	buildIllustrationURI
};
export default MenusDB;