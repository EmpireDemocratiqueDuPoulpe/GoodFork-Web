import React from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.js";
import "./AdvancedTable.css";

class ColumnType {
	_type = ColumnType.types.default;
	static types = {
		default: "text",
		text: "text",
		email: "email",
		number: "number",
		float: "float",
		bool: "bool",
		date: "date",
		select: "select"
	}

	constructor(type) {
		this._type = type ? (ColumnType.types[type] ?? ColumnType.types.default) : ColumnType.types.default;
	}

	name = () => this._type;

	default() {
		if (this._type === ColumnType.types.bool) return false;
		if (this._type === ColumnType.types.number || this._type === ColumnType.types.float) return 0;
		else return "";
	}

	inputType() {
		if (this._type === ColumnType.types.bool) return "checkbox";
		if (this._type === ColumnType.types.number || this._type === ColumnType.types.float) return "number";
		if (this._type === ColumnType.types.select) return "select";
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
	_title = "";
	_hideTitle = null;
	_propName = null;
	_type = new ColumnType(null);
	_required = null;
	_readonly = null;
	_hidden = null;
	_selectOpts = null;

	constructor(title, options) {
		this._title = title;

		if (options) {
			this._hideTitle = options.hideTitle;
			this._propName = options.propName;
			this._type = new ColumnType(options.type);
			this._required = options.required;
			this._readonly = options.readonly;
			this._hidden = options.hidden;

			if (this._type.name() === "select") {
				this._selectOpts = options.selectOpts;
			}
		}
	}

	title = () => this._hideTitle ? null : this._title;
	propName = () => this._propName ?? this._title;
	type = () => this._type;
	inputType = () => this._type.inputType();
	selectOptions = () => this._type.name() === "select" ? this._selectOpts : null;
	isRequired = () => this._required ?? false;
	isReadonly = () => this._readonly ?? false;
	isHidden = () => this._hidden ?? false;
}

export class MixedHeader {
	headers = [];

	constructor(...headers) {
		this.headers = headers;
	}

	titles() {
		return this.headers.map(header => {
			if (!header.isHidden()) {
				header.title();
			}
		});
	}

	isReadonly() {
		return this.headers.every(header => {
			return header.isReadonly();
		});
	}

	isHidden() {
		return this.headers.every(header => {
			return header.isHidden();
		});
	}
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

		const add = header => { addFields[header.propName()] = header.type().default(); };

		headers.forEach(header => {
			if (header instanceof MixedHeader) {
				header.headers.forEach(subHeader => add(subHeader));
			} else {
				add(header);
			}
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
		const { headers, data, onAdd, onUpdate, onDelete, autoID } = this.props;
		const showAdd = !!onAdd;
		const showActions = showAdd || (!!onUpdate || !!onDelete);

		return (
			<React.Fragment>
				{showAdd && <form id={addFormId} onSubmit={event => this.handleSubmit(event, "add")}/>}
				{!!onUpdate && <form id={updateFormId} onSubmit={event => this.handleSubmit(event, "update")}/>}

				<table className="advanced-table">
					<thead>
						<tr>
							{autoID && <th>-</th>}
							{headers.map((header, index) => {
								return (
									<th key={index} className={header.isHidden() ? "at-hidden" : ""}>
										{this.renderHeader(header)}
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
									{autoID && <td>{rowIndex + 1}</td>}
									{headers.map((columnHeader, headerIndex) => {
										return (
											<td key={headerIndex} className={columnHeader.isHidden() ? "at-hidden" : ""}>
												{this.renderCell(row, columnHeader, isUpdating)}
											</td>
										);
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
									return (
										<td key={headerIndex} className={columnHeader.isHidden() ? "at-hidden" : ""}>
											{this.renderAddCell(columnHeader)}
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

	renderHeader(header) {
		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<React.Fragment key={subIndex}>
						{this.renderHeader(subHeader)}
					</React.Fragment>
				);
			});
		} else {
			return (
				<React.Fragment>
					{header.title()}{header.isRequired() ? <span className="at-required-mark">*</span> : null }
				</React.Fragment>
			);
		}
	}

	renderCell(row, header, isUpdating) {
		const { updateFormId } = this.state;

		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<React.Fragment key={subIndex}>
						{this.renderCell(row, subHeader, isUpdating)}
					</React.Fragment>
				);
			});
		} else {
			const cellData = row[header.propName()];
			const cellType = header.type();

			return (
				<React.Fragment>
					{isUpdating ? (
						<InputField
							form={updateFormId}
							type={cellType.inputType()}
							value={cellData}
							selectValues={header.selectOptions()}
							currentValue={cellType.name() === "select" ? cellData : null}
							step={cellType.step()}
							onChange={value => this.handleInputChange("update", header.propName(), value)}
							readonly={header.isReadonly()}
							hidden={header.isHidden()}
							required={header.isRequired()}
						/>
					) : `${cellType.toText(cellData)} `}
				</React.Fragment>
			);
		}
	}

	renderAddCell(header) {
		if (header.isReadonly()) return null;

		const { addFormId } = this.state;

		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<React.Fragment key={subIndex}>
						{this.renderAddCell(subHeader)}
					</React.Fragment>
				);
			});
		} else {
			const cellType = header.type();

			return (
				<InputField
					form={addFormId}
					type={cellType.inputType()}
					selectValues={header.selectOptions()}
					step={cellType.step()}
					onChange={value => this.handleInputChange("add", header.propName(), value)}
					hidden={header.isHidden()}
					required={header.isRequired()}
				/>
			);
		}
	}
}

AdvancedTable.propTypes = {
	headers: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.instanceOf(Header),
			PropTypes.instanceOf(MixedHeader),
		])
	).isRequired,
	data: PropTypes.arrayOf(PropTypes.object),
	onAdd: PropTypes.func,
	onUpdate: PropTypes.func,
	onDelete: PropTypes.func,
	autoID: PropTypes.bool
};

export default AdvancedTable;