import React from "react";
import PropTypes from "prop-types";

function MeasurementSelect(props) {
	const { form, value, autoComplete, autoFocus, disabled, required, onChange, measurements } = props;

	return (
		<select
			form={form}
			defaultValue={value}
			autoComplete={autoComplete}
			autoFocus={autoFocus}
			disabled={disabled}
			required={required}
			onChange={(event) => onChange(event)}
		>
			{measurements && (
				<React.Fragment>
					{Object.entries(measurements).map(([type, units], typeIndex) => {
						return (
							<optgroup label={type} key={typeIndex}>
								{units.map((unit, unitIndex) => {
									return (
										<option key={unitIndex} value={unit.unit.unit_id}>
											{unit.unit.name}
										</option>
									);
								})}
							</optgroup>
						);
					})}
				</React.Fragment>
			)}
		</select>
	);
}

MeasurementSelect.propTypes = {
	form: PropTypes.string,
	autoComplete: PropTypes.string,
	autoFocus: PropTypes.bool,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	value: PropTypes.any,
	measurements: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.shape({
				unit: PropTypes.shape({
					type_id: PropTypes.number,
					name: PropTypes.string
				})
			})
		)
	),
	onChange: PropTypes.func
};

export default MeasurementSelect;