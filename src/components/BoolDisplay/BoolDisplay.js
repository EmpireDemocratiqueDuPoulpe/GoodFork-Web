import PropTypes from "prop-types";
import { ReactComponent as Yes } from "../../assets/images/icons/check_black_24dp.svg";
import { ReactComponent as No } from "../../assets/images/icons/close_black_24dp.svg";
import "./BoolDisplay.css";

function BoolDisplay(props) {
	const { bool } = props;

	return (
		<div className="bool-display">
			{ bool ? <Yes className="bd-icon bd-yes"/> : <No className="bd-icon bd-no"/> }
		</div>
	);
}

BoolDisplay.propTypes = {
	bool: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.number
	])
};

export default BoolDisplay;