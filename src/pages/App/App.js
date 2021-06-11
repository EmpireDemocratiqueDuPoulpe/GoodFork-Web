import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "../Index/Index.js";
import LogIn from "../LogIn/LogIn.js";
import LogOut from "../LogOut/LogOut.js";
import Staff from "../Staff/Staff.js";
import Stock from "../Stock/Stock.js";
import Menus from "../Menus/Menus.js";
import MenuDetails from "../MenuDetails/MenuDetails.js";
import Tables from "../Tables/Tables.js";
import Stats from "../Stats/Stats.js";
import Errors from "../Errors/Errors.js";
import AppLogo from "../../components/AppLogo/AppLogo.js";
import HeaderSection, { SectionItem } from "../../components/HeaderSection/HeaderSection.js";
import "./App.css";

export default function App() {
	/* ---- Page content ---------------------------- */
	return (
		<Router>
			<div className="App">
				{window.location.pathname !== "/login" && (
					<header className="App-header">
						<h1>
							<AppLogo/>
						</h1>

						<HeaderSection title="Modifier">
							<SectionItem name="Le staff" link="/staff"/>
							<SectionItem name="Les tables" link="/tables"/>
							<SectionItem name="Le menu" link="/menus"/>
							<SectionItem name="Le stock" link="/stock"/>
						</HeaderSection>

						<HeaderSection title="Voir">
							<SectionItem name="Les statistiques" link="/stats"/>
						</HeaderSection>

						<HeaderSection title="Mon compte">
							<SectionItem name="Paramètres" link="/settings" disabled={true}/>
							<SectionItem name="Déconnexion" link="/logout"/>
						</HeaderSection>
					</header>
				)}

				<div className="App-body">
					<Switch>
						<Route exact path={["/", "//", "/index"]} component={Index}/>
						<Route path="/login" component={LogIn}/>
						<Route path="/logout" component={LogOut}/>
						<Route path="/staff" component={Staff}/>
						<Route path="/stock" component={Stock}/>
						<Route path="/menus" component={Menus}/>
						<Route path="/menu/:menu_id" component={MenuDetails}/>
						<Route path="/tables" component={Tables}/>
						<Route path="/stats" component={Stats}/>
						<Route component={Errors.NotFound}/>
					</Switch>
				</div>
			</div>
		</Router>
	);
}