import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import AdvancedTable, { Header, MixedHeader } from "../../components/AdvancedTable/AdvancedTable.js";
import UnitsDB from "../../global/UnitsDB.js";
import "./MenuDetails.css";

function MenuDetails(props) {
	const { match: { params: { menu_id } } } = props;
	const [ menu, setMenu ] = useState();
	const [ units, setUnits ] = useState();
	const [ menuLoaded, setMenuLoaded ] = useState(false);
	const [ unitsLoaded, setUnitsLoaded ] = useState(false);
	const [ error, setError ] = useState();
	const [ modalError, setModalError ] = useState();

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
			});
	};

	const addIngredient = async ingredient => {
		MenusDB.addIngredient(menu, ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setModalError(response);
			})
			.catch(setModalError);
	};

	const updateIngredient = async ingredient => {
		MenusDB.updateIngredient(ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setModalError(response);
			})
			.catch(setModalError);
	};

	const deleteIngredient = async ingredient => {
		MenusDB.deleteIngredient(ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setModalError(response);
			})
			.catch(setModalError);
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
				setError(error.message);
			});
	};

	useEffect(() => { getMenu().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Menu{menuLoaded ? ` - ${menu.name}` : ""}</h3>
			</div>

			<div className="Page-body">
				<ModalError error={modalError}/>
				{menuLoaded && unitsLoaded ? (
					<React.Fragment>
						{!error ? (
							<React.Fragment>
								<Link to="/menus">&lt;-- Retour</Link>
								<img src={menu.image_path} alt="Illustration du plat"/>
								<p>Type: {menu.type}</p>
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
						) : <ErrorDisplay/>}
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