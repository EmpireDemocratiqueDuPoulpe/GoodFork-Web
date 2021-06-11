import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import reportWebVitals from "./reportWebVitals";
import App from "./pages/App/App.js";
import "normalize.css";
import "./index.css";

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<App/>
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals();