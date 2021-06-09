import withAuth from "../../components/Auth/withAuth.js";

// TODO: Index page
function Index() {
	/* ---- Page content ---------------------------- */
	return (
		<h1>Index</h1>
	);
}

export default withAuth(Index);