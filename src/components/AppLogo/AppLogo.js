import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import SmallBlackLogo from "../../assets/images/logo_small_black.png";
import SmallWhiteLogo from "../../assets/images/logo_small_white.png";
import SmallColorLogo from "../../assets/images/logo_small_color.png";
import FullBlackLogo from "../../assets/images/logo_full_black.png";
import FullWhiteLogo from "../../assets/images/logo_full_white.png";
import FullColorLogo from "../../assets/images/logo_full_color.png";
import "./AppLogo.css";

const logos = {
	small: {
		black: SmallBlackLogo,
		white: SmallWhiteLogo,
		color: SmallColorLogo
	},
	full: {
		black: FullBlackLogo,
		white: FullWhiteLogo,
		color: FullColorLogo
	}
};

const AppLogo = (props) => {
	const { version, color, circular } = props;

	return (
		<Link to="/" className={`App-logo contain-img${circular ? " circular" : ""}`}>
			<img src={logos[version][color]} alt="App logo"/>
		</Link>
	);
};

AppLogo.propTypes = {
	version: PropTypes.oneOf(["small", "full"]).isRequired,
	color: PropTypes.oneOf(["black", "white", "color"]).isRequired,
	circular: PropTypes.bool
};

AppLogo.defaultProps = {
	version: "full",
	color: "color"
};

export default AppLogo;