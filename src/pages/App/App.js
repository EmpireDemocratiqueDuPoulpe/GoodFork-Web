import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Index from "../Index/Index.js";
import Staff from "../Staff/Staff.js";
import Tables from "../Tables/Tables.js";
import Stock from "../Stock/Stock.js";
import Errors from "../Errors/Errors.js";
import "./App.css";

export default function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<h1>The Good Fork - Gestion</h1>

					<h2>--&gt; Modifier</h2>
					<ul>
						<li><Link to="/staff">Le staff</Link></li>
						<li><Link to="/tables">Les tables</Link></li>
						<li><Link to="/menu">Le menu</Link></li>
						<li><Link to="/stock">Le stock</Link></li>
					</ul>

					<h2>--&gt; Voir</h2>
					<ul>
						<li><Link to="/stats">Les statistiques</Link></li>
					</ul>
				</header>

				<div className="App-body">
					<Switch>
						<Route exact path={["/", "//", "/index"]} component={Index}/>
						<Route path="/staff" component={Staff}/>
						<Route path="/tables" component={Tables}/>
						<Route path="/stock" component={Stock}/>
						<Route component={Errors.NotFound}/>
					</Switch>
				</div>
			</div>
		</Router>
	);
}