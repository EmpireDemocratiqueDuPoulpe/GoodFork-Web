const config = {
	api: {
		users: {
			update: "http://localhost:8080/api/users"
		},
		staff: {
			add: "http://localhost:8080/api/users/staff",
			getAll: "http://localhost:8080/api/users/staff",
			delete: "http://localhost:8080/api/users/staff"
		},
		stock: {
			add: "http://localhost:8080/api/stock",
			getAll: "http://localhost:8080/api/stock/all",
			update: "http://localhost:8080/api/stock",
			delete: "http://localhost:8080/api/stock"
		}
	}
};

export default config;