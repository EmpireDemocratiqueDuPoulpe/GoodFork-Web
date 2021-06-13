import React, { useState, useEffect } from "react";
import withAuth from "../../components/Auth/withAuth.js";
import TablesDB from "../../global/TablesDB.js";
import { ModalError } from "../../components/Modal/Modal.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay.js";
import Loader from "../../components/Loader/Loader.js";
import AdvancedTable, { Header } from "../../components/AdvancedTable/AdvancedTable.js";

function Tables() {
	/* ---- States ---------------------------------- */
	const [ tables, setTables ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();
	const [ errorModal, setErrorModal ] = useState();

	/* ---- Functions ------------------------------- */
	const addTable = async table => {
		TablesDB.add(table)
			.then(response => {
				if (!response.error) getTables();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const getTables = async () => {
		TablesDB.getAll()
			.then(response => {
				setTables(response.error ? null : response.tables);
				setLoaded(true);
				setError(response.error ? response : null);
			})
			.catch(error => {
				setTables([]);
				setLoaded(true);
				setError(error);
			});
	};

	const updateTable = async table => {
		TablesDB.update(table)
			.then(response => {
				if (!response.error) getTables();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	const deleteTable = async table => {
		TablesDB.delete(table)
			.then(response => {
				if (!response.error) getTables();
				else setErrorModal(response);
			})
			.catch(setErrorModal);
	};

	useEffect(() => { getTables().catch(console.error); }, []);

	/* ---- Page content ---------------------------- */
	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Tables</h3>
			</div>

			<div className="Page-body">
				<ModalError error={errorModal}/>
				{loaded ? (
					<React.Fragment>
						{!error ? (
							<React.Fragment>
								<AdvancedTable
									headers={[
										new Header("ID", { propName: "table_id", type: "number", required: true, readonly: true, hidden: true }),
										new Header("Nom", { propName: "name" }),
										new Header("Capacité", { propName: "capacity", type: "number", required: true }),
										new Header("Est disponible", { propName: "is_available", type: "bool", centered: true }),
										new Header("Peut être utilisée", { propName: "can_be_used", type: "bool", centered: true }),
									]}
									data={tables}
									onAdd={addTable}
									onUpdate={updateTable}
									onDelete={deleteTable}
									autoID={true}
								/>
							</React.Fragment>
						) : <ErrorDisplay error={error}/>}
					</React.Fragment>
				) : <Loader/>}
			</div>
		</React.Fragment>
	);
}

export default withAuth(Tables);