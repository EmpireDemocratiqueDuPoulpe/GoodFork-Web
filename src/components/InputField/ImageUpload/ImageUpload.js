import PropTypes from "prop-types";
import InputField from "../InputField.js";
import "./ImageUpload.css";

function ImageUpload(props) {
	const { form, autoFocus, disabled, readonly, hidden, required, defaultImage, accept, onChange } = props;

	return (
		<div className="image-upload">
			<label>
				<InputField
					form={form}
					type="file"
					autoFocus={autoFocus}
					accept={accept}
					onChange={onChange}
					disabled={disabled}
					readonly={readonly}
					hidden={hidden}
					required={required}
				/>

				{defaultImage && (
					<div className="iu-image-box cover-img">
						<img src={defaultImage} alt="Mettre en ligne une illustration"/>
					</div>
				)}
			</label>
		</div>
	);
}

ImageUpload.propTypes = {
	form: PropTypes.string,
	autoFocus: PropTypes.bool,
	disabled: PropTypes.bool,
	readonly: PropTypes.bool,
	hidden: PropTypes.bool,
	required: PropTypes.bool,
	defaultImage: PropTypes.string,
	accept: PropTypes.string,
	onChange: PropTypes.func
};

export default ImageUpload;