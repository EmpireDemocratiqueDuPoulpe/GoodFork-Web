import PropTypes from "prop-types";
import { dateForField } from "../../global/Functions.js";
import "./InputField.css";

function InputField(props) {
	const {
		form, autoComplete, autoFocus, disabled, readonly, hidden, required, resize, type, value, selectValues, multiple,
		label, step, minLength, maxLength, placeholder, onChange, error, inline
	} = props;
	const id = label
		? `${label.replace(/[`~!@#$%^&*()\s_|+\-=?;:'",.<>{}[\]\\/]/gi, "").toLowerCase()}-input`
		: null;

	const handleChange = event => {
		if(!onChange) return;
		onChange(type === "checkbox" ? event.target.checked : event.target.value);
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
		case "textarea":
			return (
				<textarea
					form={form}
					id={id}
					name={id}
					style={{resize: resize}}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					placeholder={placeholder}
					value={value}
					minLength={minLength}
					maxLength={maxLength}
					onChange={handleChange}
					disabled={disabled}
					readOnly={readonly}
					required={required}
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
					placeholder={placeholder}
					defaultValue={type === "date" ? dateForField(value) : value}
					checked={type === "checkbox" ? value : null}
					step={step}
					minLength={minLength}
					maxLength={maxLength}
					onChange={handleChange}
					disabled={disabled}
					readOnly={readonly}
					hidden={hidden}
					required={required}
				/>
			);
		}
	};

	return (
		<div className={`input-field${error ? " field-error" : ""}${inline ? " field-inline" : ""}`}>
			{label && <label htmlFor={id}>{label}</label>}
			{renderInput()}
		</div>
	);
}

InputField.propTypes = {
	form: PropTypes.string,
	autoComplete: PropTypes.string,
	autoFocus: PropTypes.bool,
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
	hidden: PropTypes.bool,
	required: PropTypes.bool,
	resize: PropTypes.oneOf(["both", "horizontal", "vertical", "none"]),
	type: PropTypes.oneOf([
		"button", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number",
		"password", "radio", "range", "reset", "search", "submit", "tel", "text", "textarea", "time", "url", "week", "select"
	]).isRequired,
	value: PropTypes.any,
	selectValues: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, text: PropTypes.any.isRequired })),
	multiple: PropTypes.bool,
	step: PropTypes.number,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
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
	error: false,
	inline: false
};

export default InputField;