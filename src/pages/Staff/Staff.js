import React, { useState, useEffect } from "react";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import Users from "../../global/Users.js";
import "./Staff.css";

export default function Staff() {
	const [ members, setMembers ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const getStaff = async () => {
		Users.getStaff()
			.then(response => {
				setMembers(response.error ? null : response);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(console.error);
	};

	const deleteStaff = async member => {
		Users.deleteStaff(member)
			.then(response => {
				if (!response.error) {
					getStaff();
				} else {
					setError(response);
				}
			})
			.catch(console.error);
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
								<div className="staff-table-box">
									<table>
										<thead>
											<tr>
												<th>Pr&eacute;nom</th>
												<th>Nom</th>
												<th>E-mail</th>
												<th>R&ocirc;le</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{members.map((member, index) => {
												return (
													<tr key={index}>
														<td className="capitalize">{member.firstName}</td>
														<td className="capitalize">{member.lastName}</td>
														<td>{member.email}</td>
														<td className="capitalize">{member.role}</td>
														<td><div className="stb-delete" onClick={() => { deleteStaff(member).catch(console.error); }}/></td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}