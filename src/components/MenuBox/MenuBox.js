import PropTypes from "prop-types";
import "./MenuBox.css";

function MenuBox(props) {
	const { menu, onClick } = props;

	return (
		<div className="menu-box" onClick={() => onClick(menu)}>
			<h4>{menu.name}</h4>
			<p>{menu.description}</p>
		</div>
	);
}

MenuBox.propTypes = {
	menu: PropTypes.shape({
		menu_id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string
	}).isRequired,
	onClick: PropTypes.func
};

MenuBox.defaultProps = { onClick: () => {} };

export default MenuBox;