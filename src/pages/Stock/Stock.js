import React from "react";

export default function Stock() {
	const stockItems = [
		{ name: "Tomates", units: 201, unit_price: 5, isOrderable: true, isCookable: true, use_by_date_min: "01/01/1970", use_by_date_max: "04/06/2077" },
		{ name: "Louan", units: 4137548, unit_price: .01, isOrderable: true, isCookable: true, use_by_date_min: "01/01/1970", use_by_date_max: "04/06/2077" },
		{ name: "Riz", units: 1, unit_price: .00000001, isOrderable: true, isCookable: true, use_by_date_min: "01/01/1970", use_by_date_max: "04/06/2077" }
	];

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Stock</h3>
			</div>

			<div className="Page-body">
				<table>
					<thead>
						<tr>
							<th>Produit</th>
							<th>Unit&eacute;</th>
							<th>Prix unitaire</th>
							<th>Peut être command&eacute; ?</th>
							<th>Peut être cuit ?</th>
							<th>Date de péremption min.</th>
							<th>Date de péremption max.</th>
						</tr>
					</thead>
					<tbody>
						{stockItems.map((item, index) => {
							return (
								<tr key={index}>
									<td>{item.name}</td>
									<td>{item.units}</td>
									<td>{item.unit_price}</td>
									<td>{item.isOrderable ? "Oui" : "Non"}</td>
									<td>{item.isCookable ? "Oui" : "Non"}</td>
									<td>{item.use_by_date_min}</td>
									<td>{item.use_by_date_max}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</React.Fragment>
	);
}