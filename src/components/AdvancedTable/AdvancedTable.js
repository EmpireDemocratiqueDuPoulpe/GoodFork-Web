import React from "react";
import PropTypes from "prop-types";
import "./AdvancedTable.css";

class AdvancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addFormId: "advanced-table-add-form",
			addFields: {},
			updateFormId: "advanced-table-upd-form",
			updateRow: -1,
			updateFields: {}
		};
	}

	componentDidMount() {
		this.buildFormsIds();
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	buildFormsIds = () => {
		const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
		const addFormId = `advanced-table-add-form-${random(0, 1000)}`;
		const updateFormId = `advanced-table-upd-form-${random(0, 1000)}`;

		this.setState({ addFormId: addFormId, updateFormId: updateFormId });
	}

	/*****************************************************
	 * Add row functions
	 *****************************************************/

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleAddInputChange = (fieldName, event) => {
		const { addFields } = this.state;
		addFields[fieldName] = event.target.type === "checkbox" ? event.target.checked : event.target.value;

		this.setState({ addFields: addFields });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleAddSubmit = event => {
		event.preventDefault();

		const { addFields } = this.state;
		const { onAdd } = this.props;

		onAdd(addFields);
	}

	/*****************************************************
	 * Update row functions
	 *****************************************************/

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	startRowUpdate = index => {
		const { data } = this.props;

		this.setState({ updateRow: index, updateFields: data[index] });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleUpdInputChange = (fieldName, event) => {
		const { updateFields } = this.state;
		updateFields[fieldName] = event.target.type === "checkbox" ? event.target.checked : event.target.value;

		this.setState({ updateFields: updateFields });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleUpdSubmit = event => {
		event.preventDefault();

		const { updateFields } = this.state;
		const { onUpdate } = this.props;

		onUpdate(updateFields);
		this.setState({ updateRow: -1, updateFields: {} });
	}
	
	render() {
		const { addFormId, updateFormId, updateRow } = this.state;
		const { headers, data, onAdd, onUpdate, onDelete } = this.props;
		const showAdd = !!onAdd;
		const showActions = showAdd || (!!onUpdate || !!onDelete);

		return (
			<React.Fragment>
				{showAdd && <form id={addFormId} onSubmit={event => this.handleAddSubmit(event)}/>}
				{!!onUpdate && <form id={updateFormId} onSubmit={event => this.handleUpdSubmit(event)}/>}

				<table className="advanced-table">
					<thead>
						<tr>
							{headers.map((header, index) => {
								const title = header.title ? header.title : header;
								const hidden = header.hidden ?? false;

								return <th key={index} className={hidden ? "at-hidden" : ""}>{title}</th>;
							})}
							{showActions && <th>Actions</th>}
						</tr>
					</thead>

					<tbody>
						{data.map((row, rowIndex) => {
							const isUpdating = updateRow === rowIndex;

							return (
								<tr key={rowIndex} className={isUpdating ? "at-update-row" : ""}>
									{headers.map((associatedHeader, headIndex) => {
										const propName = associatedHeader.propName ? associatedHeader.propName : associatedHeader;
										const hidden = associatedHeader.hidden ?? false;
										const data = row[propName];

										return (
											<td key={headIndex} className={hidden ? "at-hidden" : ""}>
												{isUpdating ? (
													<input
														type={associatedHeader.type ?? "text"}
														defaultValue={data}
														onChange={event => this.handleUpdInputChange(propName, event)}
														hidden={hidden}
														required={associatedHeader.required}
													/>
												) : data}
											</td>);
									})}
									{showActions && (
										<td>
											{onUpdate && (
												<React.Fragment>
													{isUpdating ? (
														<input form={updateFormId} type="submit" value="Mettre à jour"/>
													) : (
														<div className="at-action at-update" onClick={ () => this.startRowUpdate(rowIndex) }/>
													) }
												</React.Fragment>
											)}
											{ onDelete && <div className="at-action at-delete" onClick={ () => onDelete(row) }/> }
										</td>
									)}
								</tr>
							);
						})}
						{showAdd && (
							<tr>
								{headers.map((associatedHeader, index) => {
									const propName = associatedHeader.propName ? associatedHeader.propName : associatedHeader;
									const hidden = associatedHeader.hidden ?? false;

									if (hidden) return null;

									return (
										<td key={index}>
											<input
												form={addFormId}
												type={associatedHeader.type ?? "text"}
												onChange={event => this.handleAddInputChange(propName, event)}
												required={associatedHeader.required}
											/>
										</td>);
								})}
								<td><input form={addFormId} type="submit" value="Ajouter"/></td>
							</tr>
						)}
					</tbody>
				</table>
			</React.Fragment>
		);
	}
}

AdvancedTable.propTypes = {
	headers: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				title: PropTypes.string.isRequired,
				propName: PropTypes.string,
				type: PropTypes.string,
				required: PropTypes.bool,
				hidden: PropTypes.bool
			})
		])
	).isRequired,
	data: PropTypes.arrayOf(PropTypes.object),
	onAdd: PropTypes.func,
	onUpdate: PropTypes.func,
	onDelete: PropTypes.func
};

export default AdvancedTable;