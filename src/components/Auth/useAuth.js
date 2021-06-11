import { useState } from "react";
import { useCookies } from "react-cookie";

function useToken() {
	const key = "authToken";
	const [ cookie, setCookie, removeCookie ] = useCookies([key]);

	const expirationDate = new Date();
	expirationDate.setFullYear(expirationDate.getFullYear() + 1);

	const options = {
		path: "/",
		expires: expirationDate,
		sameSite: "lax"
		//secure: true
	};

	const saveToken = token => setCookie(key, token, options);
	const removeToken = () => removeCookie(key, options);

	return { token: cookie[key], setToken: saveToken, delToken: removeToken };
}

function useLoggedIn() {
	const key = "isLoggedIn";
	const getLoggedIn = () => {
		const bool = sessionStorage.getItem(key);
		return bool !== null ? JSON.parse(bool).isLoggedIn : false;
	};

	const [ isLoggedIn, setLoggedIn ] = useState(getLoggedIn);

	const saveLoggedIn = loggedIn => {
		sessionStorage.setItem(key, JSON.stringify({isLoggedIn: loggedIn}));
		setLoggedIn(loggedIn);
	};

	return { isLoggedIn, setLoggedIn: saveLoggedIn };
}

export default function useAuth() {
	const { token, setToken, delToken } = useToken();
	const { isLoggedIn, setLoggedIn } = useLoggedIn();

	return { token, setToken, delToken, isLoggedIn, setLoggedIn };
}