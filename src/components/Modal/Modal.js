import React, { useState } from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.js";
import "./Modal.css";

/*****************************************************
 * Modal
 *****************************************************/
// TODO: Fix the bug with showedOverwrite
function Modal(props) {
	const [ isShowedOverwrite, setIsShowedOverwrite ] = useState(null);
	const [ lastTitle, setLastTitle ] = useState();
	const [ lastMessage, setLastMessage ] = useState();
	const { title, message, onOk, onYes, onCancel, onNo, isShowed } = props;

	const showModal = () => isShowedOverwrite !== null ? isShowedOverwrite : isShowed;

	const handleClose = () => {
		setIsShowedOverwrite(false);
		setLastTitle(title);
		setLastMessage(message);
	};

	if (lastTitle || lastMessage) {
		if (lastTitle !== title || lastMessage !== message) {
			setIsShowedOverwrite(null);
			setLastTitle(null);
			setLastMessage(null);
		}
	}

	return (
		<div className={`modal-background ${showModal() ? "opened" : "closed"}`}>
			<div className="modal-box">
				<div className="modal-header">
					<h4>{title}</h4>
				</div>

				<div className="modal-body">
					<p>{message}</p>

					<div className="modal-buttons">
						{onOk && (
							<InputField className="modal-button modal-ok" type="button" value="Valider" onClick={onOk}/>
						)}
						{onYes && (
							<InputField className="modal-button modal-yes" type="button" value="Oui" onClick={onYes}/>
						)}
						{onCancel && (
							<InputField className="red modal-button modal-cancel" type="button" value="Annuler" onClick={onCancel}/>
						)}
						{onNo && (
							<InputField className="red modal-button modal-no" type="button" value="Non" onClick={onNo}/>
						)}
						{(!onOk && !onYes && !onCancel && !onNo) && (
							<InputField className="modal-button modal-close" type="button" value="Fermer" onClick={handleClose}/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

Modal.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	onOk: PropTypes.func,
	onYes: PropTypes.func,
	onCancel: PropTypes.func,
	onNo: PropTypes.func,
	isShowed: PropTypes.bool.isRequired
};

export default Modal;

/*****************************************************
 * Modal error
 *****************************************************/
export function ModalError(props) {
	const { error } = props;

	if (error) {
		console.error(`Error${error.code ? ` (${error.code})`  : ""}: ${error.error ?? error.message}`);
	}

	return error ? <Modal title="Erreur" message={error.error ?? error.message} isShowed={true}/> : null;
}

ModalError.propTypes = {
	error: PropTypes.shape({
		code: PropTypes.number,
		error: PropTypes.string,
		message: PropTypes.string
	})
};