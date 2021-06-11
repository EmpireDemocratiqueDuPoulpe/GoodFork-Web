import PropTypes from "prop-types";

function ErrorDisplay(props) {
	const { error } = props;

	if (error) {
		console.error(`Error${error.code ? ` (${error.code})`  : ""}: ${error.error ?? error.message}`);
	}

	return error ? (
		<div className="page-error">
			<p>Une erreur est survenue {error.code ? `(${error.code}) ` : ""}: {error.error ?? error.message}</p>
		</div>
	) : null;
}

ErrorDisplay.propTypes = {
	error: PropTypes.shape({
		code: PropTypes.number,
		error: PropTypes.string,
		message: PropTypes.string
	})
};

export default ErrorDisplay;