import { useEffect } from "react";
import useAuth from "../../components/Auth/useAuth.js";
import withAuth from "../../components/Auth/withAuth.js";

function LogOut() {
	/* ---- States ---------------------------------- */
	const { token, delToken, isLoggedIn, setLoggedIn } = useAuth();

	useEffect(() => {
		if (token) delToken();
		if (isLoggedIn) setLoggedIn(false);
	}, []);

	/* ---- Page content ---------------------------- */
	return null;
}

export default withAuth(LogOut);