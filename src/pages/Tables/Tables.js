import React, { useState, useEffect } from "react";
import TablesDB from "../../global/TablesDB.js";
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";
import AdvancedTable, {TYPES} from "../../components/AdvancedTable/AdvancedTable";
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay";

export default function Tables() {
	const [ tables, setTables ] = useState();
	const [ loaded, setLoaded ] = useState(false);
	const [ error, setError ] = useState();

	const addTable = async table => {
		TablesDB.add(table)
			.then(response => {
				if (!response.error) {
					getTables();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
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
				console.error(error);
			});
	};

	const updateTable = async table => {
		TablesDB.update(table)
			.then(response => {
				if (!response.error) {
					getTables();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	const deleteTable = async table => {
		TablesDB.delete(table)
			.then(response => {
				if (!response.error) {
					getTables();
				} else {
					setError(response);
				}
			})
			.catch(error => {
				setError(error);
				console.error(error);
			});
	};

	useEffect(() => { getTables().catch(console.error); }, []);

	return (
		<React.Fragment>
			<div className="Page-header">
				<h3>Tables</h3>
			</div>

			<div className="Page-body">
				{loaded ? (
					<React.Fragment>
						{error ? <ErrorDisplay error={error}/> : (
							<React.Fragment>
								<AdvancedTable
									headers={[
										{ title: "ID", propName: "table_id", hidden: false, readonly: true, required: true },
										{ title: "Nom", propName: "name" },
										{ title: "Capacité", propName: "capacity", type: TYPES.number, required: true },
										{ title: "Est disponible", propName: "is_blocked", type: TYPES.bool }
									]}
									data={tables}
									onAdd={addTable}
									onUpdate={updateTable}
									onDelete={deleteTable}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				) : <LoadingDisplay/>}
			</div>
		</React.Fragment>
	);
}