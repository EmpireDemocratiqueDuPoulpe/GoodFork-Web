import React, { useState } from "react";
import PropTypes from "prop-types";
import { dateForField } from "../../global/Functions.js";
import BoolDisplay from "../BoolDisplay/BoolDisplay.js";
import MeasurementSelect from "./MeasurementSelect/MeasurementSelect.js";
import "./InputField.css";

function InputField(props) {
	const {
		form, className, autoComplete, autoFocus, disabled, readonly, hidden, required, resize, type, value, selectValues,
		multiple, label, labelSide, step, minLength, maxLength, accept, placeholder, onChange, onClick, error, inline
	} = props;
	const [ currentValue, setCurrentValue ] = useState(value);

	const id = label
		? `${label.replace(/[`~!@#$%^&*()\s_|+\-=?;:'",.<>{}[\]\\/]/gi, "").toLowerCase()}-input`
		: null;

	const handleChange = event => {
		const newValue = 
			type === "checkbox" ? event.target.checked :
				type === "file" ? event.target.files[0] :
					type === "number" ? (event.target.value.replace(",", ".") * 1) :
						event.target.value;

		setCurrentValue(newValue);

		if(onChange) onChange(newValue);
	};

	const renderInput = () => {
		switch (type) {
		case "select":
			return (
				<select
					form={form}
					id={id}
					name={id}
					defaultValue={value}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					multiple={multiple}
					disabled={disabled}
					required={required}
					onChange={handleChange}
				>
					{selectValues.map((opt, optIndex) => {
						return (
							<option key={optIndex} value={opt.value.toString()}>
								{opt.text}
							</option>
						);
					})}
				</select>
			);
		case "measurementSelect":
			return (
				<MeasurementSelect
					form={form}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					disabled={disabled}
					required={required}
					value={value}
					measurements={selectValues}
					onChange={handleChange}
				/>
			);
		case "textarea":
			return (
				<textarea
					form={form}
					id={id}
					name={id}
					style={{resize: resize}}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					placeholder={placeholder ?? " "}
					defaultValue={value}
					minLength={minLength}
					maxLength={maxLength}
					onChange={handleChange}
					disabled={disabled}
					readOnly={readonly}
					required={required}
				/>
			);
		case "checkbox":
			return (
				<label className="input-checkbox">
					<input
						form={form}
						id={id}
						name={id}
						autoComplete={autoComplete}
						autoFocus={autoFocus}
						type={type}
						checked={value}
						onChange={handleChange}
						disabled={disabled}
						readOnly={readonly}
						hidden={hidden}
						required={required}
					/>
					<BoolDisplay bool={currentValue}/>
				</label>
			);
		case "submit":
			return (
				<input
					form={form}
					id={id}
					name={id}
					autoFocus={autoFocus}
					type={type}
					value={value ?? undefined}
					onChange={handleChange}
					disabled={disabled}
					readOnly={readonly}
					hidden={hidden}
				/>
			);
		default:
			return (
				<input
					form={form}
					id={id}
					name={id}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					type={type}
					placeholder={placeholder ?? " "}
					defaultValue={type === "date" ? dateForField(value) : value}
					checked={type === "checkbox" ? value : null}
					step={step}
					minLength={minLength}
					maxLength={maxLength}
					onChange={handleChange}
					accept={type === "file" ? accept : null}
					multiple={type === "file" ? multiple : null}
					disabled={disabled}
					readOnly={readonly}
					hidden={hidden}
					required={required}
				/>
			);
		}
	};

	let classes = ["input-field", `field-${type}`];

	if (error) classes.push("field-error");
	if (inline) classes.push("field-inline");
	if (label) classes.push("field-label");
	if (currentValue) classes.push("field-not-empty");
	if (className) classes.push(className);

	return (
		<div className={classes.join(" ")} onClick={onClick}>
			{(label && labelSide === "left") && <label htmlFor={id}>{label}</label>}
			{renderInput()}
			{(label && labelSide === "right") && <label htmlFor={id}>{label}</label>}
		</div>
	);
}

InputField.propTypes = {
	form: PropTypes.string,
	className: PropTypes.string,
	autoComplete: PropTypes.string,
	autoFocus: PropTypes.bool,
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
	hidden: PropTypes.bool,
	required: PropTypes.bool,
	resize: PropTypes.oneOf(["both", "horizontal", "vertical", "none"]),
	type: PropTypes.oneOf([
		"button", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number",
		"password", "radio", "range", "reset", "search", "submit", "tel", "text", "textarea", "time", "url", "week",
		"select", "measurementSelect"
	]).isRequired,
	value: PropTypes.any,
	selectValues: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, text: PropTypes.any.isRequired })),
		PropTypes.object
	]),
	multiple: PropTypes.bool,
	step: PropTypes.number,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	accept: PropTypes.string,
	label: PropTypes.string,
	labelSide: PropTypes.oneOf(["left", "right"]),
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onClick: PropTypes.func,
	error: PropTypes.bool,
	inline: PropTypes.bool
};

InputField.defaultProps = {
	autoComplete: "on",
	autoFocus: false,
	disabled: false,
	readonly: false,
	hidden: false,
	required: false,
	resize: "both",
	selectValues: [],
	multiple: false,
	minLength: 0,
	labelSide: "left",
	error: false,
	inline: false
};

export default InputField;