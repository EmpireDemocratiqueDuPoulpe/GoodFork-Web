import { useState } from "react";
import PropTypes from "prop-types";
import InputField from "../InputField.js";
import "./PriceField.css";

function PriceField(props) {
	const { form, autoFocus, readonly, required, value, recommendedPrice, step, placeholder, onChange, error } = props;
	const [ currentPrice, setCurrentPrice ] = useState(value);

	const handleChange = price => {
		if(!onChange) return;
		setCurrentPrice(price);
		onChange(price);
	};

	return (
		<div className="price-field">
			<div className={`pf-price${currentPrice < recommendedPrice ? " pf-below-recommended" : ""}`}>
				<InputField
					form={form}
					autoFocus={autoFocus}
					readonly={readonly}
					required={required}
					inline={true}
					type="number"
					step={step}
					value={value}
					label="&euro;"
					labelSide="right"
					placeholder={placeholder}
					onChange={handleChange}
					error={error}
				/>
			</div>

			{recommendedPrice !== null ? (
				<div className="pf-recommended-price">
					<p>{recommendedPrice} <span className="pf-devise">&euro;</span></p>
				</div>
			) : null}
		</div>
	);
}

PriceField.propTypes = {
	form: PropTypes.string,
	autoFocus: PropTypes.bool,
	readonly: PropTypes.bool,
	required: PropTypes.bool,
	value: PropTypes.number,
	recommendedPrice: PropTypes.number,
	step: PropTypes.number,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.bool
};

PriceField.defaultProps = {
	recommendedPrice: null,
	step: 0.01
};

export default PriceField;