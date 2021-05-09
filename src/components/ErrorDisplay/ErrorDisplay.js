import PropTypes from "prop-types";

function ErrorDisplay(props) {
	const { error } = props;

	return (
		<div className="page-error">
			<p>Une erreur est survenue {error.code ? `(${error.code}) ` : ""}: {error.error ?? error.message}</p>
		</div>
	);
}

ErrorDisplay.propTypes = {
	error: PropTypes.shape({
		code: PropTypes.number,
		error: PropTypes.string,
		message: PropTypes.string
	})
};

export default ErrorDisplay;