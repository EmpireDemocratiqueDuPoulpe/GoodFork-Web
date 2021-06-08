import { Link } from "react-router-dom";
import LogoColor from "../../assets/images/logo_full_color.png";
import "./AppLogo.css";

const AppLogo = () => (
	<Link to="/" className="App-logo contain-img">
		<img src={LogoColor} alt="App logo"/>
	</Link>
);

export default AppLogo;