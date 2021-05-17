import { useState } from "react";
import PropTypes from "prop-types";
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
				</div>

				<div className="modal-buttons">
					{onOk && (
						<button className="modal-button modal-ok" onClick={onOk}>Valider</button>
					)}
					{onYes && (
						<button className="modal-button modal-yes" onClick={onYes}>Oui</button>
					)}
					{onCancel && (
						<button className="modal-button modal-cancel" onClick={onCancel}>Annuler</button>
					)}
					{onNo && (
						<button className="modal-button modal-no" onClick={onNo}>Non</button>
					)}
					{(!onOk && !onYes && !onCancel && !onNo) && (
						<button className="modal-button modal-close" onClick={handleClose}>Fermer</button>
					)}
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