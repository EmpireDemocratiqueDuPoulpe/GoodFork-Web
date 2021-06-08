import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import MenusDB from "../../global/MenusDB.js";
import withAuth from "../../components/Auth/withAuth.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import { ModalError } from "../../components/Modal/Modal";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import CollapsibleSection from "../../components/CollapsibleSection/CollapsibleSection.js";
import MenuBox from "../../components/MenuBox/MenuBox.js";
import AddMenuBox from "../../components/MenuBox/AddMenuBox/AddMenuBox.js";
import "./Menus.css";

function Menus() {
	const [ menus, setMenus ] = useState([]);
	const [ menusTypes, setMenusTypes ] = useState([]);
	const [ menusLoaded, setMenusLoaded ] = useState(false);
	const [ menusTypesLoaded, setMenusTypesLoaded ] = useState(false);
	const [ error, setError ] = useState();
	const [ errorModal, setErrorModal ] = useState();
	const [ redirectTo, setRedirectTo ] = useState();

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

	if (redirectTo) return <Redirect to={redirectTo}/>;

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Menus</h3>
			</div>

			<div className="Page-body">
				<ModalError error={errorModal}/>
				{menusLoaded && menusTypesLoaded ? (
					<React.Fragment>
						{!error ? (
							<div className="menus-container">
								{menusTypes.map((type, typeIndex) => {
									return (
										<CollapsibleSection title={type.name} key={typeIndex}>
											{menus.filter(menu => menu.type === type.name).map((menu, menuIndex) => {
												return <MenuBox key={menuIndex} menu={menu} onClick={() => setRedirectTo(`/menu/${menu.menu_id}`)}/>;
											})}
											<AddMenuBox type={type.name} onAdded={(menu_id) => setRedirectTo(`/menu/${menu_id}`)} onError={setErrorModal}/>
										</CollapsibleSection>
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