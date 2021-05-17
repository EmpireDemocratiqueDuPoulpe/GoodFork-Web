import React, { useState, useEffect } from "react";
import { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import AdvancedTable, { Header } from "../../components/AdvancedTable/AdvancedTable.js";
import UsersDB from "../../global/UsersDB.js";
import RolesDB from "../../global/RolesDB.js";
import "./Staff.css";

export default function Staff() {
	const [ members, setMembers ] = useState();
	const [ roles, setRoles ] = useState();
	const [ membersLoaded, setMembersLoaded ] = useState(false);
	const [ rolesLoaded, setRolesLoaded ] = useState(false);
	const [ error, setError ] = useState();
	const [ errorModal, setErrorModal ] = useState();

	const addStaff = async member => {
		UsersDB.addStaff(member)
			.then(response => {
				if (!response.error) getStaff();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const getStaff = async () => {
		UsersDB.getStaff()
			.then(response => {
				setMembers(response.error ? null : response.staff);
				setMembersLoaded(true);
				setError(response.error ? response : null);

				if (!response.error) getRoles();
			})
			.catch(error => {
				setMembers([]);
				setMembersLoaded(true);
				setError(error);
			});
	};

	const updateStaff = async member => {
		UsersDB.update(member)
			.then(response => {
				if (!response.error) getStaff();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const deleteStaff = async member => {
		UsersDB.deleteStaff(member)
			.then(response => {
				if (!response.error) getStaff();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const getRoles = async () => {
		RolesDB.getAllAsSelect()
			.then(response => {
				setRoles(response.error ? null : response);
				setRolesLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setRoles([]);
				setRolesLoaded(true);
				setError(error);
			});
	};

	useEffect(() => { getStaff().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Staff</h3>
			</div>

			<div className="Page-body">
				<ModalError error={errorModal}/>
				{membersLoaded && rolesLoaded ? (
					<React.Fragment>
						{!error ? (
							<React.Fragment>
								<AdvancedTable
									headers={[
										new Header("ID", { propName: "user_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("Prénom", { propName: "first_name", required: true }),
										new Header("Nom", { propName: "last_name" }),
										new Header("E-mail", { propName: "email", type: "email", required: true }),
										new Header("Rôle", {
											propName: "role_id",
											displayPropName: "role",
											type: "select",
											selectOpts: roles,
											required: true
										})
									]}
									data={members}
									onAdd={addStaff}
									onUpdate={updateStaff}
									onDelete={deleteStaff}
								/>
							</React.Fragment>
						) : <ErrorDisplay error={error}/>}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}