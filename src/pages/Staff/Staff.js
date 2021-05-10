import React, { useState, useEffect } from "react";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import AdvancedTable, { TYPES } from "../../components/AdvancedTable/AdvancedTable.js";
import UsersDB from "../../global/UsersDB.js";
import "./Staff.css";

export default function Staff() {
	const [ members, setMembers ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const addStaff = async member => {
		UsersDB.addStaff(member)
			.then(response => {
				if (!response.error) {
					getStaff();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const getStaff = async () => {
		UsersDB.getStaff()
			.then(response => {
				setMembers(response.error ? null : response);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setMembers([]);
				setLoaded(true);
				setError(error);
				console.error(error);
			});
	};

	const updateStaff = async member => {
		UsersDB.update(member)
			.then(response => {
				if (!response.error) {
					getStaff();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const deleteStaff = async member => {
		UsersDB.deleteStaff(member)
			.then(response => {
				if (!response.error) {
					getStaff();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	useEffect(() => { getStaff().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Staff</h3>
			</div>

			<div className="Page-body">
				{loaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<AdvancedTable
									headers={[
										{ title: "ID", propName: "user_id", hidden: true, required: true },
										{ title: "Prénom", propName: "first_name", required: true },
										{ title: "Nom", propName: "last_name" },
										{ title: "E-mail", propName: "email", type: TYPES.email, required: true },
										{ title: "Rôle", propName: "role", required: true }
									]}
									data={members}
									onAdd={addStaff}
									onUpdate={updateStaff}
									onDelete={deleteStaff}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}