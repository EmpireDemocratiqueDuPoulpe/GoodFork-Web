import PropTypes from "prop-types";

function InputField(props) {
	const {
		form, autoComplete, autoFocus, disabled, readonly, hidden, required,
		type, value, label, step, minLength, maxLength, placeholder, onChange, error
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
			<input
				form={form}
				id={id}
				name={id}
				autoComplete={autoComplete}
				autoFocus={autoFocus}
				type={type}
				placeholder={placeholder}
				defaultValue={value}
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
		"password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"
	]).isRequired,
	value: PropTypes.string,
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
	minLength: 0,
	error: false
};

export default InputField;