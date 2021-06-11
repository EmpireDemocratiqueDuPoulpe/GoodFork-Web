import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import UsersDB from "../../global/UsersDB.js";
import useAuth from "../../components/Auth/useAuth.js";
import withAuth from "../../components/Auth/withAuth.js";
import { ModalError } from "../../components/Modal/Modal.js";
import AppLogo from "../../components/AppLogo/AppLogo.js";
import InputField from "../../components/InputField/InputField.js";
import "./LogIn.css";

function LogIn() {
	/* ---- States ---------------------------------- */
	const [ email, setEmail ] = useState();
	const [ password, setPassword ] = useState();
	const [ errorModal, setErrorModal ] = useState();
	const { setToken, isLoggedIn, setLoggedIn } = useAuth();

	/* ---- Functions ------------------------------- */
	const handleSubmit = async event => {
		event.preventDefault();

		UsersDB.logIn(email, password)
			.then(response => {
				if (response.error) setErrorModal(response);
				else {
					setToken(response.token);
					setLoggedIn(true);
				}
			})
			.catch(err => {
				setErrorModal(err);
			});
	};

	/* ---- Page content ---------------------------- */
	if (isLoggedIn) return <Redirect to="/"/>;
	return (
		<div className="login-page">
			<ModalError error={errorModal}/>

			<div className="login-box">
				<AppLogo version={"small"} circular={true}/>
				<h2>Connexion</h2>

				<form onSubmit={handleSubmit}>
					<InputField label="E-mail" type="email" onChange={value => setEmail(value)} required={true}/>
					<InputField label="Mot de passe" type="password" onChange={value => setPassword(value)} required={true}/>
					<InputField type="submit" value="Se connecter"/>
				</form>
			</div>
		</div>
	);
}

export default withAuth(LogIn, true);