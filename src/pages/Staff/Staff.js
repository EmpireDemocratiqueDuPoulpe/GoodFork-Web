import React from "react";

export default function Staff() {
	const members = [
		{ firstName: "Louan", lastName: "grosNoob", email: "louan.grosnoob@goodfork.fr", role: "barmen" },
		{ firstName: "Maxence", lastName: "Puddlesky", email: "maxence.puddlesky@goodfork.fr", role: "cook" },
		{ firstName: "Geoffrey", lastName: "", email: "geoffrey@goodfork.fr", role: "cook" },
		{ firstName: "Imprimante multifonction", lastName: "EPSON Expression XP-2105", email: "imprimantemultifonction.epson@goodfork.fr", role: "waiter" }
	];

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Staff</h3>
			</div>

			<div className="Page-body">
				<table>
					<thead>
						<tr>
							<th>Pr&eacute;nom</th>
							<th>Nom</th>
							<th>E-mail</th>
							<th>R&ocirc;le</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member, index) => {
							return (
								<tr key={index}>
									<td>{member.firstName}</td>
									<td>{member.lastName}</td>
									<td>{member.email}</td>
									<td>{member.role}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</React.Fragment>
	);
}