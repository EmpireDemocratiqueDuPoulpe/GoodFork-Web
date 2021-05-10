import React from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.js";
import "./AdvancedTable.css";

export const TYPES = {
	default: "text",
	text: "text",
	email: "email",
	number: "number",
	float: "float",
	bool: "bool",
	date: "date"
};

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
		this.startRowAddition();
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	buildFormsIds = () => {
		const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
		const addFormId = `advanced-table-add-form-${random(0, 1000)}`;
		const updateFormId = `advanced-table-upd-form-${random(0, 1000)}`;

		this.setState({ addFormId: addFormId, updateFormId: updateFormId });
	}

	convertData(type, value) {
		if (type === TYPES.bool) {
			return value ? "Oui" : "Non";
		}

		return value;
	}

	getDefaultValue(type) {
		if (type === TYPES.bool) return false;
		if (type === TYPES.number || type === TYPES.float) return 0;
		else return "";
	}

	getInputType(type) {
		if (type === TYPES.bool) return "checkbox";
		if (type === TYPES.float) return "number";
		return type;
	}

	/*****************************************************
	 * Add row functions
	 *****************************************************/

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	startRowAddition = () => {
		const { headers } = this.props;
		const addFields = {};

		headers.forEach(header => {
			const type = header.type ?? TYPES.default;

			addFields[header.propName] = this.getDefaultValue(type);
		});

		this.setState({ addFields: addFields });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleAddInputChange = (fieldName, value) => {
		const { addFields } = this.state;
		addFields[fieldName] = value;

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
	handleUpdInputChange = (fieldName, value) => {
		const { updateFields } = this.state;
		updateFields[fieldName] = value;

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
								const required = header.required ?? false;
								const hidden = header.hidden ?? false;

								return (
									<th key={index} className={hidden ? "at-hidden" : ""}>
										{title}{required ? <span className="at-required-mark">*</span> : null }
									</th>
								);
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
										const type = associatedHeader.type ?? TYPES.default;
										const inputType = this.getInputType(type);
										const readonly = associatedHeader.readonly ?? false;
										const hidden = associatedHeader.hidden ?? false;
										const data = row[propName];
										const convertedData = this.convertData(type, data);

										return (
											<td key={headIndex} className={hidden ? "at-hidden" : ""}>
												{isUpdating && !readonly ? (
													<InputField
														type={inputType}
														value={data}
														step={type === TYPES.float ? 0.1 : (type === TYPES.number ? 1 : null)}
														onChange={value => this.handleUpdInputChange(propName, value)}
														hidden={hidden}
														required={associatedHeader.required}
													/>
												) : convertedData}
											</td>);
									})}
									{showActions && (
										<td>
											{onUpdate && (
												<React.Fragment>
													{isUpdating ? (
														<InputField form={updateFormId} type="submit" value="Mettre à jour"/>
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
									const type = associatedHeader.type ?? "text";
									const inputType = this.getInputType(type);
									const readonly = associatedHeader.readonly ?? false;
									const hidden = associatedHeader.hidden ?? false;

									if (hidden) return null;
									if (readonly) return <td/>;

									return (
										<td key={index}>
											<InputField
												form={addFormId}
												type={inputType}
												step={type === TYPES.float ? 0.1 : (type === TYPES.number ? 1 : null)}
												onChange={value => this.handleAddInputChange(propName, value)}
												required={associatedHeader.required}
											/>
										</td>);
								})}
								<td><InputField form={addFormId} type="submit" value="Ajouter"/></td>
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
				type: PropTypes.oneOf([ "text", "number", "bool" ]),
				required: PropTypes.bool,
				readonly: PropTypes.bool,
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