import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import MenusDB from "../../global/MenusDB.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";
import MenuBox from "../../components/MenuBox/MenuBox.js";

export default function Menus() {
	const [ menus, setMenus ] = useState([]);
	const [ clickedMenu, setClickedMenu ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const getMenus = async () => {
		MenusDB.getAll()
			.then(response => {
				setMenus(response.error ? null : response.menus);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setMenus([]);
				setLoaded(true);
				setError(error);
				console.error(error);
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
				{loaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								{menus.map((menu, index) => {
									return <MenuBox key={index} menu={menu} onClick={setClickedMenu}/>;
								})}
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}