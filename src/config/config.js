// TODO: Change API url to EC2 instance IP
export const API_URI = "http://localhost:8080/api";
export const API_FILES_URI = "http://localhost:8080/images";

const config = {
	auth: {
		roleLevel: "owner"
	},
	api: {
		headers: { Accept: "application/json" },
		users: {
			logIn: { method: "post", uri: `${API_URI}/users/login` },
			logInToken: { method: "post", uri: `${API_URI}/users/login/token` },
			update: { method: "put", uri: `${API_URI}/users` }
		},
		staff: {
			add: { method: "post", uri: `${API_URI}/users/staff` },
			getAll: { method: "get", uri: `${API_URI}/users/staff/all` },
			delete: { method: "delete", uri: `${API_URI}/users/staff` }
		},
		roles: {
			getAll: { method: "get", uri: `${API_URI}/roles/all` }
		},
		stock: {
			add: { method: "post", uri: `${API_URI}/stock` },
			getAll: { method: "get", uri: `${API_URI}/stock/all` },
			update: { method: "put", uri: `${API_URI}/stock` },
			delete: { method: "delete", uri: `${API_URI}/stock` }
		},
		units: {
			getAll: { method: "get", uri: `${API_URI}/units/all` }
		},
		menus: {
			uploadIllustration: { method: "post", uri: `${API_URI}/menus/upload/illustration` },
			getAll: { method: "get", uri: `${API_URI}/menus/all` },
			getById: { method: "get", uri: `${API_URI}/menus` },
			update: { method: "put", uri: `${API_URI}/menus` },
			delete: { method: "delete", uri: `${API_URI}/menus` }
		},
		menuTypes: {
			getAll: { method: "get", uri: `${API_URI}/menus/types/all` },
		},
		ingredients: {
			add: { method: "post", uri: `${API_URI}/menus/ingredients` },
			update: { method: "put", uri: `${API_URI}/menus/ingredients` },
			delete: { method: "delete", uri: `${API_URI}/menus/ingredients` }
		},
		tables: {
			add: { method: "post", uri: `${API_URI}/tables` },
			getAll: { method: "get", uri: `${API_URI}/tables/all` },
			update: { method: "put", uri: `${API_URI}/tables` },
			delete: { method: "delete", uri: `${API_URI}/tables` }
		}
	}
};

export default config;