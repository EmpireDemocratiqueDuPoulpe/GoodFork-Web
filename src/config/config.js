const config = {
	api: {
		users: {
			update: "http://localhost:8080/api/users"
		},
		staff: {
			add: "http://localhost:8080/api/users/staff",
			getAll: "http://localhost:8080/api/users/staff",
			delete: "http://localhost:8080/api/users/staff"
		}
	}
};

export default config;