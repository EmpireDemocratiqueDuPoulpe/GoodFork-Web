import PropTypes from "prop-types";
import { dateForField } from "../../global/Functions.js";

function InputField(props) {
	const {
		form, autoComplete, autoFocus, disabled, readonly, hidden, required, type, value, selectValues,
		multiple, label, step, minLength, maxLength, placeholder, onChange, error
	} = props;
	const id = label
		? `${label.replace(/[`~!@#$%^&*()\s_|+\-=?;:'",.<>{}[\]\\/]/gi, "").toLowerCase()}-input`
		: null;

	const handleChange = event => {
		if(!onChange) return;
		onChange(type === "checkbox" ? event.target.checked : event.target.value);
	};

	return (
		<div className={`input-field ${error ? "field-error" : ""}`}>
			{label && <label htmlFor={id}>{label}</label>}
			{type === "select" ? (
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
			) : (
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
			)}
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
	type: PropTypes.oneOf([
		"button", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number",
		"password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week", "select"
	]).isRequired,
	value: PropTypes.any,
	selectValues: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.any, text: PropTypes.any.isRequired })),
	currentValue: PropTypes.any,
	multiple: PropTypes.bool,
	step: PropTypes.number,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.bool
};

InputField.defaultProps = {
	autoComplete: "on",
	autoFocus: false,
	disabled: false,
	readonly: false,
	hidden: false,
	required: false,
	selectValues: [],
	multiple: false,
	minLength: 0,
	error: false
};

export default InputField;