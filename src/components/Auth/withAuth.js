import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import useAuth from "./useAuth.js";
import UsersDB from "../../global/UsersDB.js";

export default function withAuth(Component, reverse = false) {
	const AuthRoute = props => {
		const [ isLoaded, setLoaded ] = useState(false);
		const { token, isLoggedIn, setLoggedIn } = useAuth();
		const url = window.location.href;
		const redirectUrl = reverse ? "/" : "/login";

		useEffect(() => {
			if(!isLoggedIn && token) {
				LogIn(token)
					.then(response => {
						if (!response.error) setLoggedIn(true);
						else console.error(response.code, response.error);
						setLoaded(true);
					})
					.catch(err => {
						console.error(err);
						setLoaded(true);
					});
			} else setLoaded(true);
		}, []);

		// TODO: Better loading
		// Wait for log in
		if (!isLoaded) return <p>Loading...</p>;

		// Check if it must redirect or not
		let willRedirect = !isLoggedIn && !url.includes("/login");

		if (reverse) {
			if (url.includes("/login")) willRedirect = false;
			else willRedirect = !willRedirect;
		}

		return willRedirect
			? <Redirect to={redirectUrl}/>
			: <Component {...props} token={token}/>;
	};

	return AuthRoute;
}

async function LogIn(token) {
	try {
		return await UsersDB.logInWithToken(token);
	} catch (err) {
		return { error: "Unknown error" };
	}
}