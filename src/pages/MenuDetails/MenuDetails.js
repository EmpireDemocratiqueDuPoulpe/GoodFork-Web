import React from "react";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import UnitsDB from "../../global/UnitsDB.js";
import withAuth from "../../components/Auth/withAuth.js";
import Modal, { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import AdvancedTable, { Header, MixedHeader } from "../../components/AdvancedTable/AdvancedTable.js";
import InputField from "../../components/InputField/InputField.js";
import ImageUpload from "../../components/InputField/ImageUpload/ImageUpload.js";
import PriceField from "../../components/InputField/PriceField/PriceField.js";
import "./MenuDetails.css";

class MenuDetails extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			menu: null,
			menuLoaded: false,
			menuTypes: [],
			menuTypesLoaded: false,
			units: [],
			unitsLoaded: false,
			updateFields: {},
			error: false,
			errorModal: null,
			deleteModal: false,
			redirectTo: null
		};
	}

	componentDidMount() {
		this.getMenu().catch();
		this.getMenuTypes().catch();
		this.getUnits().catch();
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleChange = (fieldName, value) => {
		const { updateFields } = this.state;

		updateFields[fieldName] = value;
		this.setState({ updateFields });
	};

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleSubmit = event => {
		event.preventDefault();
		const { updateFields } = this.state;

		MenusDB.update(updateFields)
			.then(response => {
				if (!response.error) this.getMenu();
				else this.setState({ errorModal: response });
			})
			.catch(error => this.setState({ errorModal: error }));
	};

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleUploadSubmit = file => {
		const { menu } = this.state;

		if (file) {
			MenusDB.uploadIllustration(menu, file)
				.then(response => {
					if (!response.error) this.getMenu();
					else this.setState({ errorModal: response });
				})
				.catch(error => this.setState({ errorModal: error }));
		}
	};

	/*****************************************************
	 * Menu
	 *****************************************************/
	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	getMenu = async () => {
		const { match: { params: { menu_id } } } = this.props;

		MenusDB.getById(menu_id)
			.then(response => this.setState({ menu: response.menu, updateFields: { menu_id: response.menu.menu_id }, menuLoaded: true, error: response.error }))
			.catch(error => this.setState({ menu: null, updateFields: null, menuLoaded: true, error: error }));
	};

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	getMenuTypes = async () => {
		MenusDB.getTypesAsSelect()
			.then(response => this.setState({ menuTypes: response, menuTypesLoaded: true, error: response.error }))
			.catch(error => this.setState({ menuTypes: [], menuTypesLoaded: true, error: error }));
	};

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	deleteMenu = async () => {
		const { menu } = this.state;

		MenusDB.delete(menu)
			.then(response => this.setState({ redirectTo: response.error ? null : "/menus", errorModal: response.error }))
			.catch(error => this.setState({ errorModal: error }));
	};

	/*****************************************************
	 * Ingredients
	 *****************************************************/
	addIngredient = async ingredient => {
		const { menu } = this.state;

		MenusDB.addIngredient(menu, ingredient)
			.then(response => {
				if (!response.error) this.getMenu();
				else this.setState({ errorModal: response });
			})
			.catch(error => this.setState({ errorModal: error }));
	};

	updateIngredient = async ingredient => {
		MenusDB.updateIngredient(ingredient)
			.then(response => {
				if (!response.error) this.getMenu();
				else this.setState({ errorModal: response });
			})
			.catch(error => this.setState({ errorModal: error }));
	};

	deleteIngredient = async ingredient => {
		MenusDB.deleteIngredient(ingredient)
			.then(response => {
				if (!response.error) this.getMenu();
				else this.setState({ errorModal: response });
			})
			.catch(error => this.setState({ errorModal: error }));
	};

	/*****************************************************
	 * Units
	 *****************************************************/
	getUnits = async () => {
		UnitsDB.getAllAsSelect()
			.then(response => {
				this.setState({ units: response, unitsLoaded: true, error: response.error });
			})
			.catch(error => this.setState({ units: [], unitsLoaded: true, error: error }));
	};

	render() {
		const {
			menu, menuLoaded, menuTypes, menuTypesLoaded, units, unitsLoaded,
			error, errorModal, deleteModal, redirectTo
		} = this.state;
		const updFormId = "update-menu-form";
		const uploadFormId = "upload-menu-form";

		if (redirectTo) return <Redirect to={redirectTo}/>;
		return (
			<React.Fragment>
				<form id={updFormId} onSubmit={this.handleSubmit}/>
				<form id={uploadFormId} onSubmit={this.handleUploadSubmit} encType="multipart/form-data"/>

				<div className="Page-header">
					<Link className="Ph-back" to="/menus">&lt;</Link>
					<h3>{menuLoaded ? "Menu -" : "Menu"}</h3>
					{menuLoaded ? (
						<InputField
							form={updFormId}
							type="text"
							value={menu.name}
							placeholder="Nom du menu"
							onChange={value => this.handleChange("name", value)}
							inline={true}
							required={true}
						/>
					) : null}
				</div>

				<div className="Page-body">
					<ModalError error={errorModal}/>
					{menuLoaded && menuTypesLoaded && unitsLoaded ? (
						<React.Fragment>
							{!error ? (
								<React.Fragment>
									<Modal
										title={`Supprimer le menu "${menu.name}"`}
										message="Êtes-vous sûr de vouloir supprimer ce menu ? Il n'y a pas moyen d'annuler cette action"
										isShowed={deleteModal}
										onYes={() => this.deleteMenu(menu)}
										onNo={() => this.setState({ deleteModal: false })}
									/>

									<div className="menu-infos">
										<ImageUpload
											form={uploadFormId}
											defaultImage={MenusDB.buildIllustrationURI(menu.image_path)}
											accept="image/jpeg,image/png,image/bmp"
											onChange={value => this.handleUploadSubmit(value)}
										/>

										<div className="mi-type-description">
											<InputField
												form={updFormId}
												type="select"
												label="Type :"
												value={menu.type_id}
												selectValues={menuTypes}
												onChange={value => this.handleChange("type_id", value)}
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
												onChange={value => this.handleChange("description", value)}
											/>

											<div className="mi-buttons">
												<input form={updFormId} className="mi-button" type="submit" value="Enregistrer"/>
												<button className="mi-button" onClick={() => this.setState({ deleteModal: true })}>Supprimer</button>
											</div>
										</div>

										<PriceField
											form={updFormId}
											value={menu.price}
											recommendedPrice={10}
											step={0.01}
											onChange={value => this.handleChange("price", value)}
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
														type: "select",
														selectOpts: units,
														hideTitle: true
													})
												)
											]}
											data={menu.ingredients}
											onAdd={this.addIngredient}
											onUpdate={this.updateIngredient}
											onDelete={this.deleteIngredient}
											autoID={true}
										/>
									</div>
								</React.Fragment>
							) : <ErrorDisplay/>}
						</React.Fragment>
					) : <LoadingDisplay/>}
				</div>
			</React.Fragment>
		);
	}
}

MenuDetails.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			menu_id: PropTypes.string.isRequired
		})
	})
};

export default withAuth(MenuDetails);