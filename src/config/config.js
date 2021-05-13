// TODO: Change API url to EC2 instance IP
const API_URI = "http://localhost:8080/api";

const config = {
	api: {
		headers: { Accept: "application/json" },
		users: {
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
		tables: {
			add: { method: "post", uri: `${API_URI}/tables` },
			getAll: { method: "get", uri: `${API_URI}/tables/all` },
			update: { method: "put", uri: `${API_URI}/tables` },
			delete: { method: "delete", uri: `${API_URI}/tables` }
		}
	}
};

export default config;