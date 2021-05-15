import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";
import AdvancedTable, {Header, MixedHeader} from "../../components/AdvancedTable/AdvancedTable.js";
import UnitsDB from "../../global/UnitsDB";

function MenuDetails(props) {
	const { match: { params: { menu_id } } } = props;
	const [ menu, setMenu ] = useState();
	const [ units, setUnits ] = useState();
	const [ menuLoaded, setMenuLoaded ] = useState(false);
	const [ unitsLoaded, setUnitsLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const getMenu = async () => {
		MenusDB.getById(menu_id)
			.then(response => {
				setMenu(response.error ? null : response.menu);
				setMenuLoaded(true);
				setError(response.error ? response : null);

				if (!response.error) getUnits();
			})
			.catch(error => {
				setMenu(null);
				setMenuLoaded(true);
				setError(error);
				console.error(error);
			});
	};

	const addIngredient = async ingredient => {
		MenusDB.addIngredient(menu, ingredient)
			.then(response => {
				if (!response.error) {
					getMenu();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const updateIngredient = async ingredient => {
		MenusDB.updateIngredient(ingredient)
			.then(response => {
				if (!response.error) {
					getMenu();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const deleteIngredient = async ingredient => {
		MenusDB.deleteIngredient(ingredient)
			.then(response => {
				if (!response.error) {
					getMenu();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const getUnits = async () => {
		UnitsDB.getAllAsSelect()
			.then(response => {
				setUnits(response.error ? null : response);
				setUnitsLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setUnits([]);
				setUnitsLoaded(true);
				setError(error);
				console.error(error);
			});
	};

	useEffect(() => { getMenu().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Menu{menuLoaded ? ` - ${menu.name}` : ""}</h3>
			</div>

			<div className="Page-body">
				{menuLoaded && unitsLoaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<p>Description: {menu.description}</p>
								<h4>Ingrédients: </h4>
								<AdvancedTable
									headers={[
										new Header("ID", { propName: "ingredient_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("ID Stock", { propName: "stock_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("Nom", { propName: "name", required: true }),
										new MixedHeader(
											new Header("Quantité", { propName: "units", type: "float" }),
											new Header("Unité", {
												propName: "units_unit_id",
												displayPropName: "units_unit",
												type: "select",
												selectOpts: units,
												hideTitle: true
											})
										)
									]}
									data={menu.ingredients}
									onAdd={addIngredient}
									onUpdate={updateIngredient}
									onDelete={deleteIngredient}
									autoID={true}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}

MenuDetails.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			menu_id: PropTypes.string.isRequired
		})
	})
};

export default MenuDetails;