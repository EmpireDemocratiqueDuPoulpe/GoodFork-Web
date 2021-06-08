import React from "react";
import PropTypes from "prop-types";
import MenusDB from "../../../global/MenusDB.js";
import { ReactComponent as AddIcon } from "../../../assets/images/icons/add_black_24dp.svg";
import "./AddMenuBox.css";

function AddMenuBox(props) {
	const { type, onClick, onAdded, onError } = props;

	const handleClick = () => {
		if (onClick) onClick();

		MenusDB.add({ type: type })
			.then(response => {
				if (!response.error) onAdded(response.menu_id);
				else onError(response);
			})
			.catch(onError);
	};

	return (
		<div className="menu-box add-menu-box" onClick={handleClick}>
			<AddIcon className="amb-add-icon"/>
			<span className="amb-add-text">Ajouter</span>
		</div>
	);
}

AddMenuBox.propTypes = {
	type: PropTypes.oneOf(["entrée", "plat", "dessert", "boisson"]).isRequired,
	onClick: PropTypes.func,
	onAdded: PropTypes.func,
	onError: PropTypes.func
};

AddMenuBox.defaultProps = {
	onAdded: () => {},
	onError: () => {}
};

export default AddMenuBox;