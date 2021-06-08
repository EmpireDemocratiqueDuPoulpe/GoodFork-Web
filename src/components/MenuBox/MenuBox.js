import React from "react";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import "./MenuBox.css";

function MenuBox(props) {
	const { menu, onClick } = props;

	return (
		<div className="menu-box" onClick={() => onClick(menu)}>
			<h4 className="mb-name capitalize ellipsis">{menu.name}</h4>

			<div className="mb-illustration cover-img">
				<img src={MenusDB.buildIllustrationURI(menu.image_path)} alt="Illustration du plat"/>
			</div>

			<p className="mb-description ellipsis-multiline">{menu.description && menu.description.length > 0 ? menu.description : "Pas de description"}</p>
		</div>
	);
}

MenuBox.propTypes = {
	menu: PropTypes.shape({
		menu_id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		image_path: PropTypes.string
	}).isRequired,
	onClick: PropTypes.func
};

MenuBox.defaultProps = { onClick: () => {} };

export default MenuBox;