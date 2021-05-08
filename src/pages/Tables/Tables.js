import React from "react";

export default function Tables() {
	const tables = [
		{ id: 1, capacity: 2, isBlocked: false },
		{ id: 2, capacity: 4, isBlocked: false },
		{ id: 3, capacity: 8, isBlocked: false },
		{ id: 4, capacity: 4, isBlocked: true },
		{ id: 5, capacity: 4, isBlocked: false },
		{ id: 6, capacity: 102, isBlocked: false },
		{ id: 7, capacity: 1, isBlocked: true },
	];

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Tables</h3>
			</div>

			<div className="Page-body">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Capacit&eacute;</th>
							<th>Bloqu&eacute;e ?</th>
						</tr>
					</thead>
					<tbody>
						{tables.map((table, index) => {
							return (
								<tr key={index}>
									<td>{table.id}</td>
									<td>{table.capacity}</td>
									<td>{table.isBlocked ? "Oui" : ""}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</React.Fragment>
	);
}