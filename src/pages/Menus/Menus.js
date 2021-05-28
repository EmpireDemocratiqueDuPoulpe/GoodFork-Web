import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import MenusDB from "../../global/MenusDB.js";
import withAuth from "../../components/Auth/withAuth.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import MenuBox from "../../components/MenuBox/MenuBox.js";
import AddMenuBox from "../../components/MenuBox/AddMenuBox/AddMenuBox.js";
import "./Menus.css";

function Menus() {
	const [ menus, setMenus ] = useState([]);
	const [ menusTypes, setMenusTypes ] = useState([]);
	const [ clickedMenu, setClickedMenu ] = useState();
	const [ menusLoaded, setMenusLoaded ] = useState(false);
	const [ menusTypesLoaded, setMenusTypesLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const getMenus = async () => {
		MenusDB.getAll(true)
			.then(response => {
				setMenus(response.error ? null : response.menus);
				setMenusLoaded(true);
				setError(response.error ? response : null);

				if (!response.error) getMenusTypes();
			})
			.catch(error => {
				setMenus([]);
				setMenusLoaded(true);
				setError(error);
			});
	};

	const getMenusTypes = async () => {
		MenusDB.getTypes()
			.then(response => {
				setMenusTypes(response.error ? null : response.types);
				setMenusTypesLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setMenusTypes([]);
				setMenusTypesLoaded(true);
				setError(error);
			});
	};

	useEffect(() => { getMenus().catch(console.error); }, []);

	if (clickedMenu) return <Redirect to={`/menu/${clickedMenu.menu_id}`}/>;

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Menus</h3>
			</div>

			<div className="Page-body">
				{menusLoaded && menusTypesLoaded ? (
					<React.Fragment>
						{!error ? (
							<div className="menus-container">
								{menusTypes.map((type, typeIndex) => {
									return (
										<div className="mc-category" key={typeIndex}>
											<div className="mc-category-header">
												<h3 className="capitalize">{type.name}</h3>
											</div>

											<div className="mc-category-body">
												{menus.filter(menu => menu.type === type.name).map((menu, menuIndex) => {
													return <MenuBox key={menuIndex} menu={menu} onClick={setClickedMenu}/>;
												})}
												<AddMenuBox/>
											</div>
										</div>
									);
								})}
							</div>
						) : <ErrorDisplay error={error}/>}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}

export default withAuth(Menus);