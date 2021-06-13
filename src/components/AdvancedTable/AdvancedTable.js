import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { dateForDisplay } from "../../global/Functions.js";
import InputField from "../InputField/InputField.js";
import BoolDisplay from "../InputField/BoolDisplay/BoolDisplay.js";
import {ReactComponent as EditLogo} from "../../assets/images/icons/edit_black_24dp.svg";
import {ReactComponent as StopEditLogo} from "../../assets/images/icons/do_not_disturb_on_black_24dp.svg";
import {ReactComponent as DeleteLogo} from "../../assets/images/icons/delete_black_24dp.svg";
import "./AdvancedTable.css";

/*****************************************************
 * Column types and headers
 *****************************************************/

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

/*****************************************************
 * Advanced table
 *****************************************************/
function AdvancedTable(props) {
	/* ---- States ---------------------------------- */
	const [ addFormId, setAddFormId ] = useState("advanced-table-add-form");
	const [ addFields, setAddFields ] = useState({});
	const [ updFormId, setUpdFormId ] = useState("advanced-table-upd-form");
	const [ updFields, setUpdFields ] = useState({});
	const [ updRow, setUpdRow ] = useState(-1);

	const { headers, data, onAdd, onUpdate, onDelete, autoID, centered } = props;
	const showAdd = !!onAdd;
	const showActions = showAdd || (!!onUpdate || !!onDelete);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		buildFormsIds();
		startRowAddition();
	}, []);

	/* ---- Functions ------------------------------- */
	const buildFormsIds = () => {
		const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

		setAddFormId(`advanced-table-add-form-${random(0, 1000)}`);
		setUpdFormId(`advanced-table-upd-form-${random(0, 1000)}`);
	};

	const startRowAddition = () => {
		const addFields = {};

		const add = header => { addFields[header.propName()] = header.defaultValue(); };

		headers.forEach(header => {
			if (header instanceof MixedHeader) {
				header.headers.forEach(subHeader => add(subHeader));
			} else {
				add(header);
			}
		});

		setAddFields(addFields);
	};

	const startRowUpdate = index => {
		setUpdRow(index);
		setUpdFields(data[index]);
	};

	const stopRowUpdate = (emptyFields = false) => {
		setUpdRow(-1);
		if (emptyFields) setUpdFields({});
	};

	const handleInputChange = (action, fieldName, value) => {
		if (action === "add") {
			const fields = addFields;
			fields[fieldName] = value;

			setAddFields(fields);
		} else if (action === "update") {
			const fields = updFields;
			fields[fieldName] = value;

			setUpdFields(fields);
		}
	};

	const handleSubmit = (event, action) => {
		event.preventDefault();

		if (action === "add") {
			onAdd(addFields);
			//startRowAddition();
		} else if (action === "update") {
			onUpdate(updFields);
			stopRowUpdate(true);
		}
	};

	/* ---- Page content ---------------------------- */
	const renderHeader = header => {
		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<React.Fragment key={subIndex}>
						{renderHeader(subHeader)}
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
	};

	const renderCell = (row, header, isUpdating) => {
		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<span key={subIndex} className={`atmf-item${isUpdating ? "" : " atmf-item-space"}`}>
						{renderCell(row, subHeader, isUpdating)}
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
							form={updFormId}
							type={cellType.inputType()}
							value={cellData}
							selectValues={header.selectOptions()}
							step={cellType.step()}
							onChange={value => handleInputChange("update", header.propName(), value)}
							readonly={header.isReadonly()}
							hidden={header.isHidden()}
							required={header.isRequired()}
						/>
					) : cellType.toComponent(displayData ?? cellData)}
				</React.Fragment>
			);
		}
	};

	const renderAddCell = header => {
		if (header.isReadonly()) return null;

		if (header instanceof MixedHeader) {
			return header.headers.map((subHeader, subIndex) => {
				return (
					<React.Fragment key={subIndex}>
						{renderAddCell(subHeader)}
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
					onChange={value => handleInputChange("add", header.propName(), value)}
					hidden={header.isHidden()}
					required={header.isRequired()}
				/>
			);
		}
	};

	return (
		<React.Fragment>
			{showAdd && <form id={addFormId} onSubmit={event => handleSubmit(event, "add")}/>}
			{!!onUpdate && <form id={updFormId} onSubmit={event => handleSubmit(event, "update")}/>}

			<table className={`advanced-table ${centered ? "advanced-table-centered" : ""}`}>
				<thead>
					<tr>
						{autoID && <th>-</th>}
						{headers.map((header, index) => {
							return (
								<th key={index} className={header.isHidden() ? "at-hidden" : ""}>
									{renderHeader(header)}
								</th>
							);
						})}
						{showActions && <th>Actions</th>}
					</tr>
				</thead>

				<tbody>
					{data.map((row, rowIndex) => {
						const isUpdating = updRow === rowIndex;

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
													? <div>{renderCell(row, columnHeader, isUpdating)}</div>
													: renderCell(row, columnHeader, isUpdating)
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
															<InputField form={updFormId} type="submit" value="Mettre à jour"/>
															<div className="at-action at-stop-update" onClick={() => stopRowUpdate()}>
																<StopEditLogo/>
															</div>
														</React.Fragment>
													) : (
														<div className="at-action at-update" onClick={() => startRowUpdate(rowIndex)}>
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
										{isMixedHeader ? <div>{renderAddCell(columnHeader)}</div> : renderAddCell(columnHeader)}
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