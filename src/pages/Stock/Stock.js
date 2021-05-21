import React, { useState, useEffect } from "react";
import { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.js";
import AdvancedTable, { Header, MixedHeader } from "../../components/AdvancedTable/AdvancedTable.js";
import StockDB from "../../global/StockDB.js";
import UnitsDB from "../../global/UnitsDB.js";

export default function Stock() {
	const [ stock, setStock ] = useState();
	const [ units, setUnits ] = useState();
	const [ stockLoaded, setStockLoaded ] = useState(false);
	const [ unitsLoaded, setUnitsLoaded ] = useState(false);
	const [ error, setError ] = useState();
	const [ errorModal, setErrorModal ] = useState();

	const addStock = async item => {
		StockDB.add(item)
			.then(response => {
				if (!response.error) getAll();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
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
			});
	};

	const updateStock = async item => {
		StockDB.update(item)
			.then(response => {
				if (!response.error) getAll();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const deleteStock = async item => {
		StockDB.delete(item)
			.then(response => {
				if (!response.error) getAll();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
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
			});
	};

	useEffect(() => { getAll().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Stock</h3>
			</div>

			<div className="Page-body">
				<ModalError error={errorModal}/>
				{stockLoaded && unitsLoaded ? (
					<React.Fragment>
						{!error ? (
							<React.Fragment>
								<AdvancedTable
									headers={[
										new Header("ID", { propName: "stock_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("Produit", { propName: "name", required: true }),
										new MixedHeader(
											new Header("Quantité", { propName: "units", type: "float" }),
											new Header("Unité", {
												propName: "units_unit_id",
												displayPropName: "units_unit",
												type: "select",
												selectOpts: units,
												hideTitle: true
											})
										),
										new Header("Prix à l'unité", { propName: "unit_price", type: "float" }),
										new Header("Peut être commandé", { propName: "is_orderable", type: "bool", centered: true }),
										new Header("Peut être cuisiné", { propName: "is_cookable", type: "bool", centered: true }),
										new Header("Date de péremption min.", { propName: "use_by_date_min", type: "date" }),
										new Header("Date de péremption max.", { propName: "use_by_date_max", type: "date" })
									]}
									data={stock}
									onAdd={addStock}
									onUpdate={updateStock}
									onDelete={deleteStock}
								/>
							</React.Fragment>
						) : <ErrorDisplay error={error}/>}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}