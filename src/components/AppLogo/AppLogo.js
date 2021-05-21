import { Link } from "react-router-dom";
import LogoBlack from "../../assets/images/logo_full_black.png";
import "./AppLogo.css";

const AppLogo = () => (
	<Link to="/" className="App-logo">
		<img src={LogoBlack} alt="App logo"/>
	</Link>
);

export default AppLogo;