import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import MeasurementsDB from "../../global/MeasurementsDB.js";
import withAuth from "../../components/Auth/withAuth.js";
import Modal, { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import Loader from "../../components/Loader/Loader.js";
import AdvancedTable, { Header, MixedHeader } from "../../components/AdvancedTable/AdvancedTable.js";
import InputField from "../../components/InputField/InputField.js";
import ImageUpload from "../../components/InputField/ImageUpload/ImageUpload.js";
import PriceField from "../../components/InputField/PriceField/PriceField.js";
import "./MenuDetails.css";

async function calculatePrice(menu) {
	let price = 0;

	for (const ingredient of menu.ingredients) {
		const convertedQuantity = await MeasurementsDB.convert(ingredient.units, ingredient.units_unit, ingredient.stock_units_unit);

		price += convertedQuantity.conversion * ingredient.unit_price;
	}

	return price.toFixed(2);
}

function MenuDetails(props) {
	/* ---- States ---------------------------------- */
	const [ menu, setMenu ] = useState();
	const [ menuLoaded, setMenuLoaded ] = useState(false);
	const [ menuTypes, setMenuTypes ] = useState([]);
	const [ menuTypesLoaded, setMenuTypesLoaded ] = useState(false);
	const [ measurements, setMeasurements ] = useState([]);
	const [ measurementsLoaded, setMeasurementLoaded ] = useState(false);
	const [ updateFields, setUpdateFields ] = useState({});
	const [ error, setError ] = useState(false);
	const [ errorModal, setErrorModal ] = useState(null);
	const [ deleteModal, setDeleteModal ] = useState(false);
	const [ redirectTo, setRedirectTo ] = useState(null);
	const [ recommendedPrice, setRecommendedPrice ] = useState(null);

	const updFormId = "update-menu-form";
	const uploadFormId = "upload-menu-form";

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		getMenu().catch();
		getMenuTypes().catch();
		getMeasurements().catch();
	}, []);

	useEffect(() => {
		setTimeout(async () => {
			if (!menu) return;
			setRecommendedPrice(await calculatePrice(menu));
		}, 0);
	}, [menu]);

	/* ---- Functions ------------------------------- */
	const handleChange = (fieldName, value) => {
		const newUpdateFields = updateFields;

		newUpdateFields[fieldName] = value;
		setUpdateFields(newUpdateFields);
	};

	const handleSubmit = event => {
		event.preventDefault();

		MenusDB.update(updateFields)
			.then(response => {
				if (!response.error) getMenu().catch();
				else setErrorModal(response);
			})
			.catch(error => setErrorModal(error));
	};

	const handleUploadSubmit = file => {
		if (file) {
			MenusDB.uploadIllustration(menu, file)
				.then(response => {
					if (!response.error) getMenu().catch();
					else setErrorModal(response);
				})
				.catch(error => setErrorModal(error));
		}
	};

	const getMenu = async () => {
		const { match: { params: { menu_id } } } = props;

		MenusDB.getById(menu_id)
			.then(response => {
				setMenu(response.menu);
				setUpdateFields({ menu_id: response.menu.menu_id });
				setMenuLoaded(true);
				setError(response.error);
			})
			.catch(error => {
				setMenu(null);
				setUpdateFields(null);
				setMenuLoaded(true);
				setError(error);
			});
	};

	const getMenuTypes = async () => {
		MenusDB.getTypesAsSelect()
			.then(response => {
				setMenuTypes(response);
				setMenuTypesLoaded(true);
				setError(response.error);
			})
			.catch(error => {
				setMenuTypes([]);
				setMenuTypesLoaded(true);
				setError(error);
			});
	};

	const deleteMenu = async () => {
		MenusDB.delete(menu)
			.then(response => {
				setRedirectTo(response.error ? null : "/menus");
				setErrorModal(response.error);
			})
			.catch(error => setErrorModal(error));
	};

	const addIngredient = async ingredient => {
		MenusDB.addIngredient(menu, ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setErrorModal(response);
			})
			.catch(error => setErrorModal(error));
	};
	
	const updateIngredient = async ingredient => {
		MenusDB.updateIngredient(ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setErrorModal(response);
			})
			.catch(error => setErrorModal(error));
	};

	const deleteIngredient = async ingredient => {
		MenusDB.deleteIngredient(ingredient)
			.then(response => {
				if (!response.error) getMenu();
				else setErrorModal(response);
			})
			.catch(error => setErrorModal(error));
	};

	const getMeasurements = async () => {
		MeasurementsDB.getAllByTypes()
			.then(response => {
				setMeasurements(response.measurements);
				setMeasurementLoaded(true);
				setError(response.error);
			})
			.catch(error => {
				setMeasurements([]);
				setMeasurementLoaded(true);
				setError(error);
			});
	};

	/* ---- Page content ---------------------------- */
	if (redirectTo) return <Redirect to={redirectTo}/>;
	return (
		<React.Fragment>
			<form id={updFormId} onSubmit={handleSubmit}/>
			<form id={uploadFormId} onSubmit={handleUploadSubmit} encType="multipart/form-data"/>

			<div className="Page-header">
				<Link className="Ph-back" to="/menus">&lt;</Link>
				<h3>{menuLoaded ? "Menu -" : "Menu"}</h3>
				{menuLoaded ? (
					<InputField
						form={updFormId}
						type="text"
						value={menu.name}
						placeholder="Nom du menu"
						onChange={value => handleChange("name", value)}
						inline={true}
						required={true}
					/>
				) : null}
			</div>

			<div className="Page-body">
				<ModalError error={errorModal}/>
				{menuLoaded && menuTypesLoaded && measurementsLoaded ? (
					<React.Fragment>
						{!error ? (
							<React.Fragment>
								<Modal
									title={`Supprimer le menu "${menu.name}"`}
									message="Êtes-vous sûr de vouloir supprimer ce menu ? Il n'y a pas moyen d'annuler cette action"
									isShowed={deleteModal}
									onYes={() => deleteMenu(menu)}
									onNo={() => setDeleteModal(false)}
								/>

								<div className="menu-infos">
									<ImageUpload
										form={uploadFormId}
										defaultImage={MenusDB.buildIllustrationURI(menu.image_path)}
										accept="image/jpeg,image/png,image/bmp"
										onChange={value => handleUploadSubmit(value)}
									/>

									<div className="mi-type-description">
										<InputField
											form={updFormId}
											type="select"
											label="Type :"
											value={menu.type_id}
											selectValues={menuTypes}
											onChange={value => handleChange("type_id", value)}
											required={true}
											inline={true}
										/>
										<InputField
											form={updFormId}
											className="mi-description"
											type="textarea"
											resize="none"
											value={menu.description}
											placeholder="Description"
											onChange={value => handleChange("description", value)}
										/>

										<div className="mi-buttons">
											<InputField form={updFormId} className="mi-button" type="submit" value="Mettre à jour"/>
											<InputField className="red mi-button" type="button" value="Supprimer" onClick={() => setDeleteModal(true)}/>
										</div>
									</div>

									<PriceField
										form={updFormId}
										value={menu.price}
										recommendedPrice={recommendedPrice}
										step={0.01}
										onChange={value => handleChange("price", value)}
										required={true}
									/>
								</div>

								<div className="menu-content">
									<h4>Ingr&eacute;dients: </h4>

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
													type: "measurementSelect",
													defaultValue: 1,
													selectOpts: measurements,
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
								</div>
							</React.Fragment>
						) : <ErrorDisplay/>}
					</React.Fragment>
				) : <Loader/>}
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

export default withAuth(MenuDetails);