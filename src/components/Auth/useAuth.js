import { useState } from "react";
import { useCookies } from "react-cookie";

function useToken() {
	const key = "authToken";
	const [ cookie, setCookie ] = useCookies([key]);

	const expirationDate = new Date();
	expirationDate.setFullYear(expirationDate.getFullYear() + 1);

	const options = {
		path: "/",
		expires: expirationDate,
		//expires: Date.now() + 365 * 86400000,
		//secure: true
	};

	const saveToken = token => setCookie(key, token, options);

	return { token: cookie[key], setToken: saveToken };
}

function useLoggedIn() {
	const key = "isLoggedIn";
	const getLoggedIn = () => {
		const bool = sessionStorage.getItem(key);
		return bool !== null ? JSON.parse(bool) : false;
	};

	const [ isLoggedIn, setLoggedIn ] = useState(getLoggedIn);

	const saveLoggedIn = loggedIn => {
		sessionStorage.setItem(key, JSON.stringify({isLoggedIn: loggedIn}));
		setLoggedIn(loggedIn);
	};

	return { isLoggedIn, setLoggedIn: saveLoggedIn };
}

export default function useAuth() {
	const { token, setToken } = useToken();
	const { isLoggedIn, setLoggedIn } = useLoggedIn();


	return { token, setToken, isLoggedIn, setLoggedIn };
}

/*export default function useAuth() {
	const cookieName = "authToken";
	const [ cookie, setCookie ] = useCookies([cookieName]);
	const [ isLoggedIn, setLoggedIn ] = useState(false);

	const expirationDate = new Date();
	expirationDate.setFullYear(expirationDate.getFullYear() + 1);

	const options = {
		path: "/",
		expires: expirationDate,
		//expires: Date.now() + 365 * 86400000,
		//secure: true
	};

	const saveToken = token => setCookie(cookieName, token, options);
	const saveLoggedIn = loggedIn => {
		sessionStorage.setItem("isLoggedIn", JSON.stringify({isLoggedIn: loggedIn}));
		setLoggedIn(loggedIn);
	};

	return { token: cookie[cookieName], setToken: saveToken, isLoggedIn, setLoggedIn: saveLoggedIn };
}*/