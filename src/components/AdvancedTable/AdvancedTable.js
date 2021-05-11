import React from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.js";
import "./AdvancedTable.css";

class ColumnType {
	static types = {
		default: "text",
		text: "text",
		email: "email",
		number: "number",
		float: "float",
		bool: "bool",
		date: "date"
	}

	constructor(type) {
		this._type = type ? (ColumnType.types[type] ?? ColumnType.types.default) : ColumnType.types.default;
	}

	default() {
		if (this._type === ColumnType.types.bool) return false;
		if (this._type === ColumnType.types.number || this._type === ColumnType.types.float) return 0;
		else return "";
	}

	inputType() {
		if (this._type === ColumnType.types.bool) return "checkbox";
		if (this._type === ColumnType.types.number || this._type === ColumnType.types.float) return "number";
		else return this._type;
	}

	step() {
		if (this._type === ColumnType.types.number) return 1;
		if (this._type === ColumnType.types.float) return 0.1;
		else return null;
	}

	toText(value) {
		if (this._type === ColumnType.types.bool) return value ? "Oui" : "Non";
		else return value ?? this.default();
	}
}

export class Header {
	constructor(title, options) {
		this._title = title;
		this._type = new ColumnType(options ? options.type : null);

		if (options) {
			this._propName = options.propName;
			this._unit = options.unit;
			this._required = options.required;
			this._readonly = options.readonly;
			this._hidden = options.hidden;
		}

	}

	title = () => this._title;
	propName = () => this._propName ?? this._title;
	type = () => this._type;
	inputType = () => this._type.inputType();
	hasUnit = () => this._unit ?? false;
	isRequired = () => this._required ?? false;
	isReadonly = () => this._readonly ?? false;
	isHidden = () => this._hidden ?? false;
}

// TODO: Paging system
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

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	startRowAddition = () => {
		const { headers } = this.props;
		const addFields = {};

		headers.forEach(header => {
			addFields[header.propName()] = header.type().default();
		});

		this.setState({ addFields: addFields });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	startRowUpdate = index => {
		const { data } = this.props;

		this.setState({ updateRow: index, updateFields: data[index] });
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleInputChange = (action, fieldName, value) => {
		const { addFields, updateFields } = this.state;

		if (action === "add") {
			addFields[fieldName] = value;
			this.setState({ addFields: addFields });
		} else if (action === "update") {
			updateFields[fieldName] = value;
			this.setState({ updateFields: updateFields });
		}
	}

	/* This is an arrow function to keep access to "this" without binding the function in the constructor */
	handleSubmit = (event, action) => {
		event.preventDefault();

		const { addFields, updateFields } = this.state;
		const { onAdd, onUpdate } = this.props;

		if (action === "add") {
			onAdd(addFields);
			this.setState({ addFields: {} });
		} else if (action === "update") {
			onUpdate(updateFields);
			this.setState({ updateRow: -1, updateFields: {} });
		}
	}
	
	render() {
		const { addFormId, updateFormId, updateRow } = this.state;
		const { headers, data, onAdd, onUpdate, onDelete } = this.props;
		const showAdd = !!onAdd;
		const showActions = showAdd || (!!onUpdate || !!onDelete);

		return (
			<React.Fragment>
				{showAdd && <form id={addFormId} onSubmit={event => this.handleSubmit(event, "add")}/>}
				{!!onUpdate && <form id={updateFormId} onSubmit={event => this.handleSubmit(event, "update")}/>}

				<table className="advanced-table">
					<thead>
						<tr>
							{headers.map((header, index) => {
								return (
									<th key={index} className={header.isHidden() ? "at-hidden" : ""}>
										{header.title()}{header.isRequired() ? <span className="at-required-mark">*</span> : null }
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
									{headers.map((columnHeader, headerIndex) => {
										const cellData = row[columnHeader.propName()];
										const cellType = columnHeader.type();

										return (
											<td key={headerIndex} className={columnHeader.isHidden() ? "at-hidden" : ""}>
												{isUpdating && !columnHeader.isReadonly() ? (
													<InputField
														type={cellType.inputType()}
														value={cellData}
														step={cellType.step()}
														onChange={value => this.handleInputChange("input", columnHeader.propName(), value)}
														hidden={columnHeader.isHidden()}
														required={columnHeader.isRequired()}
													/>
												) : `${cellType.toText(cellData)} ${columnHeader.hasUnit() ? data[rowIndex].unit : ""}`}
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
								{headers.map((columnHeader, headerIndex) => {
									const cellType = columnHeader.type();

									if (columnHeader.isHidden()) return null;
									if (columnHeader.isReadonly()) return <td/>;

									return (
										<td key={headerIndex}>
											<InputField
												form={addFormId}
												type={cellType.inputType()}
												step={cellType.step()}
												onChange={value => this.handleInputChange("add", columnHeader.propName(), value)}
												required={columnHeader.isRequired()}
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
	headers: PropTypes.arrayOf(PropTypes.instanceOf(Header)).isRequired,
	data: PropTypes.arrayOf(PropTypes.object),
	onAdd: PropTypes.func,
	onUpdate: PropTypes.func,
	onDelete: PropTypes.func
};

export default AdvancedTable;