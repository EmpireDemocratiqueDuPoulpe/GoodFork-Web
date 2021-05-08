import PropTypes from "prop-types";

function ErrorDisplay(props) {
	const { error } = props;

	return (
		<div className="page-error">
			<p>Une erreur est survenue {error.code ? `(${error.code}) ` : ""}: ${error.error}</p>
		</div>
	);
}

ErrorDisplay.propTypes = {
	error: PropTypes.shape({
		code: PropTypes.number,
		error: PropTypes.string.isRequired
	})
};

export default ErrorDisplay;