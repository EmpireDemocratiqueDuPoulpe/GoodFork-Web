import React from "react";
import PropTypes from "prop-types";
//import MenusDB from "../../../global/MenusDB.js";
import { ReactComponent as AddIcon } from "../../../assets/images/icons/add_black_24dp.svg";
import "./AddMenuBox.css";

function AddMenuBox(props) {
	const { onClick } = props;

	const handleClick = () => {
		if (onClick) onClick();
	};

	return (
		<div className="menu-box add-menu-box" onClick={handleClick}>
			<AddIcon className="amb-add-icon"/>
			<span className="amb-add-text">Ajouter</span>
		</div>
	);
}

AddMenuBox.propTypes = {
	onClick: PropTypes.func
};

export default AddMenuBox;