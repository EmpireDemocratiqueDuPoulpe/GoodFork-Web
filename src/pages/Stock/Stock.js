import React, { useState, useEffect } from "react";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import AdvancedTable, { Header, MixedHeader } from "../../components/AdvancedTable/AdvancedTable";
import StockDB from "../../global/StockDB.js";
import UnitsDB from "../../global/UnitsDB.js";

export default function Stock() {
	const [ stock, setStock ] = useState();
	const [ units, setUnits ] = useState();
	const [ stockLoaded, setStockLoaded ] = useState(false);
	const [ unitsLoaded, setUnitsLoaded ] = useState(false);
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
				setStockLoaded(true);
				setError(response.error ? response : null);

				if (!response.error) getUnits();
			})
			.catch(error => {
				setStock([]);
				setStockLoaded(true);
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

	const getUnits = async () => {
		UnitsDB.getAllAsSelect()
			.then(response => {
				setUnits(response.error ? null : response);
				setUnitsLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setUnits([]);
				setUnitsLoaded(true);
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
				{stockLoaded && unitsLoaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<AdvancedTable
									headers={[
										new Header("ID", { propName: "stock_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("Produit", { propName: "name", required: true }),
										new MixedHeader(
											new Header("Quantité", { propName: "units", type: "float" }),
											new Header("Unité", { propName: "units_unit", type: "select", selectOpts: units, hideTitle: true })
										),
										new Header("Prix à l'unité", { propName: "unit_price", type: "float" }),
										new Header("Peut être commandé", { propName: "is_orderable", type: "bool" }),
										new Header("Peut être cuisiné", { propName: "is_cookable", type: "bool" }),
										new Header("Date de péremption min.", { propName: "use_by_date_min", type: "date" }),
										new Header("Date de péremption max.", { propName: "use_by_date_max", type: "date" })
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