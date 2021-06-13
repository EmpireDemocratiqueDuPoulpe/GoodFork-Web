import React from "react";
import PropTypes from "prop-types";
import { dateForDisplay } from "../../global/Functions.js";
import InputField from "../InputField/InputField.js";
import BoolDisplay from "../InputField/BoolDisplay/BoolDisplay.js";
import { ReactComponent as EditLogo } from "../../assets/images/icons/edit_black_24dp.svg";
import { ReactComponent as StopEditLogo } from "../../assets/images/icons/do_not_disturb_on_black_24dp.svg";
import { ReactComponent as DeleteLogo } from "../../assets/images/icons/delete_black_24dp.svg";
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
		select: "select",
		measurementSelect: "measurementSelect"
	}

	constructor(type) {
		this._type = type ? (ColumnType.types[type] ?? ColumnType.types.default) : ColumnType.types.default;
	}

	name = () => this._type;

	default() {
		if (this._type === ColumnType.types.bool) return false;
		if (this._type === ColumnType.types.number || this._type === ColumnType.types.float) return 0;
		if (this._type === ColumnType.types.date) return null;
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

	toComponent(value) {
		if (this._type === ColumnType.types.bool) return <BoolDisplay bool={value}/>;
		if (this._type === ColumnType.types.date) return <React.Fragment>{dateForDisplay(value) ?? ""}</React.Fragment>;
		else return <React.Fragment>{value ?? this.default()}</React.Fragment>;
	}
}

export class Header {
	_title = "";
	_hideTitle = null;
	_propName = null;
	_displayPropName = null;
	_type = new ColumnType(null);
	_defaultValue = null;
	_required = null;
	_readonly = null;
	_hidden = null;
	_centered = null;
	_selectOpts = null;

	constructor(title, options) {
		this._title = title;

		if (options) {
			this._hideTitle = options.hideTitle;
			this._propName = options.propName;
			this._displayPropName = options.displayPropName;
			this._type = new ColumnType(options.type);
			this._defaultValue = options.defaultValue ?? this._type.default();
			this._required = options.required;
			this._readonly = options.readonly;
			this._hidden = options.hidden;
			this._centered = options.centered;

			if (this._type.name() === "select" || this._type.name() === "measurementSelect") {
				this._selectOpts = options.selectOpts;
			}
		}
	}

	title = () => this._hideTitle ? null : this._title;
	propName = () => this._propName ?? this._title;
	displayPropName = () => this._displayPropName;
	type = () => this._type;
	defaultValue = () => this._defaultValue;
	inputType = () => this._type.inputType();
	selectOptions = () => this._selectOpts ?? null;
	isRequired = () => this._required ?? false;
	isReadonly = () => this._readonly ?? false;
	isHidden = () => this._hidden ?? false;
	isCentered = () => this._centered ?? false;
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

	isCentered() {
		return this.headers.every(header => {
			return header.isCentered();
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

		const add = header => { addFields[header.propName()] = header.defaultValue(); };

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
	stopRowUpdate = (emptyFields = false) => {
		const newState = { updateRow: -1 };
		if (emptyFields) newState["updateFields"] = {};

		this.setState(newState);
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
			//this.startRowAddition();
		} else if (action === "update") {
			onUpdate(updateFields);
			this.stopRowUpdate(true);
		}
	}
	
	render() {
		const { addFormId, updateFormId, updateRow } = this.state;
		const { headers, data, onAdd, onUpdate, onDelete, autoID, centered } = this.props;
		const showAdd = !!onAdd;
		const showActions = showAdd || (!!onUpdate || !!onDelete);

		return (
			<React.Fragment>
				{showAdd && <form id={addFormId} onSubmit={event => this.handleSubmit(event, "add")}/>}
				{!!onUpdate && <form id={updateFormId} onSubmit={event => this.handleSubmit(event, "update")}/>}

				<table className={`advanced-table ${centered ? "advanced-table-centered" : ""}`}>
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
									{autoID && <td className="at-centered">{rowIndex + 1}</td>}
									{headers.map((columnHeader, headerIndex) => {
										let classes = [];
										const isMixedHeader = columnHeader instanceof MixedHeader;

										if (columnHeader.isHidden()) classes.push("at-hidden");
										if (columnHeader.isCentered()) classes.push("at-centered");
										if (isMixedHeader) classes.push("at-multiple-fields");

										return (
											<td key={headerIndex} className={classes.join(" ")}>

												{
													isMixedHeader
														? <div>{this.renderCell(row, columnHeader, isUpdating)}</div>
														: this.renderCell(row, columnHeader, isUpdating)
												}
											</td>
										);
									})}
									{showActions && (
										<td className="at-centered">
											<div className="at-actions">
												{onUpdate && (
													<React.Fragment>
														{isUpdating ? (
															<React.Fragment>
																<InputField form={updateFormId} type="submit" value="Mettre à jour"/>
																<div className="at-action at-stop-update" onClick={() => this.stopRowUpdate()}>
																	<StopEditLogo/>
																</div>
															</React.Fragment>
														) : (
															<div className="at-action at-update" onClick={() => this.startRowUpdate(rowIndex)}>
																<EditLogo/>
															</div>
														)}
													</React.Fragment>
												)}
												{(onDelete && !isUpdating) && (
													<div className="at-action at-delete" onClick={() => onDelete(row)}>
														<DeleteLogo/>
													</div>
												)}
											</div>
										</td>
									)}
								</tr>
							);
						})}
						{showAdd && (
							<tr>
								{autoID && <td/>}
								{headers.map((columnHeader, headerIndex) => {
									let classes = [];
									const isMixedHeader = columnHeader instanceof MixedHeader;

									if (columnHeader.isHidden()) classes.push("at-hidden");
									if (columnHeader.isCentered()) classes.push("at-centered");
									if (isMixedHeader) classes.push("at-multiple-fields");

									return (
										<td key={headerIndex} className={classes.join(" ")}>
											{isMixedHeader ? <div>{this.renderAddCell(columnHeader)}</div> : this.renderAddCell(columnHeader)}
										</td>
									);
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
					<span key={subIndex} className={`atmf-item${isUpdating ? "" : " atmf-item-space"}`}>
						{this.renderCell(row, subHeader, isUpdating)}
					</span>
				);
			});
		} else {
			const cellData = row[header.propName()];
			const displayData = row[header.displayPropName()];
			const cellType = header.type();

			return (
				<React.Fragment>
					{isUpdating ? (
						<InputField
							form={updateFormId}
							type={cellType.inputType()}
							value={cellData}
							selectValues={header.selectOptions()}
							step={cellType.step()}
							onChange={value => this.handleInputChange("update", header.propName(), value)}
							readonly={header.isReadonly()}
							hidden={header.isHidden()}
							required={header.isRequired()}
						/>
					) : cellType.toComponent(displayData ?? cellData)}
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
					className="field-full-width"
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
	autoID: PropTypes.bool,
	centered: PropTypes.bool
};

export default AdvancedTable;