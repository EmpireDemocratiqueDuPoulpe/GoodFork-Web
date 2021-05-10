import React, { useState, useEffect } from "react";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import AdvancedTable, { TYPES } from "../../components/AdvancedTable/AdvancedTable";
import StockDB from "../../global/StockDB.js";

export default function Stock() {
	const [ stock, setStock ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const addStock = async item => {
		StockDB.add(item)
			.then(response => {
				if (!response.error) {
					getAll();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const getAll = async () => {
		StockDB.getAll()
			.then(response => {
				setStock(response.error ? null : response.stocks);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setStock([]);
				setLoaded(true);
				setError(error);
				console.error(error);
			});
	};

	const updateStock = async item => {
		StockDB.update(item)
			.then(response => {
				if (!response.error) {
					getAll();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const deleteStock = async item => {
		StockDB.delete(item)
			.then(response => {
				if (!response.error) {
					getAll();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	useEffect(() => { getAll().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Stock</h3>
			</div>

			<div className="Page-body">
				{loaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<AdvancedTable
									headers={[
										{ title: "ID", propName: "stock_id", hidden: true, required: true },
										{ title: "Produit", propName: "name", required: true },
										{ title: "Quantité", propName: "units", type: TYPES.float },
										{ title: "Prix à l'unité", propName: "unit_price", type: TYPES.float },
										{ title: "Peut être commandé", propName: "is_orderable", type: TYPES.bool },
										{ title: "Peut être cuisiné", propName: "is_cookable", type: TYPES.bool },
										{ title: "Date de péremption min.", propName: "use_by_date_min", type: TYPES.date },
										{ title: "Date de péremption max.", propName: "use_by_date_max", type: TYPES.date }
									]}
									data={stock}
									onAdd={addStock}
									onUpdate={updateStock}
									onDelete={deleteStock}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}