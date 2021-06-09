import { Link } from "react-router-dom";

export default function NotFound() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="error-box error-404">
			<span className="error-emoji highlight-font">( ͠° ʖ̯ ͡°)</span>

			<div className="error-content">
				<h2 className="error-code highlight-font">404</h2>
				<h3 className="error-message highlight-font">Page inexistante</h3>
				<Link className="error-link link" to="/">Retour à la page principale</Link>
			</div>
		</div>
	);
}