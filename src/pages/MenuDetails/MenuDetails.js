import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MenusDB from "../../global/MenusDB.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";

function MenuDetails(props) {
	const { match: { params: { menu_id } } } = props;
	const [ menu, setMenu ] = useState([]);
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const getMenu = async () => {
		MenusDB.getById(menu_id)
			.then(response => {
				setMenu(response.error ? null : response.menu);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setMenu(null);
				setLoaded(true);
				setError(error);
				console.error(error);
			});
	};

	useEffect(() => { getMenu().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Menu{loaded ? ` - ${menu.name}` : ""}</h3>
			</div>

			<div className="Page-body">
				{loaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<p>Chargé !</p>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}

MenuDetails.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			menu_id: PropTypes.string.isRequired
		})
	})
};

export default MenuDetails;