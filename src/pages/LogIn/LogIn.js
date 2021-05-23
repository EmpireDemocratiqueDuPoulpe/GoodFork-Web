import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import UsersDB from "../../global/UsersDB.js";
import useAuth from "../../components/Auth/useAuth.js";
import withAuth from "../../components/Auth/withAuth.js";
import { ModalError } from "../../components/Modal/Modal.js";
import InputField from "../../components/InputField/InputField.js";

function LogIn() {
	const [ email, setEmail ] = useState();
	const [ password, setPassword ] = useState();
	const [ errorModal, setErrorModal ] = useState();
	const { setToken, isLoggedIn, setLoggedIn } = useAuth();

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

	if (isLoggedIn) return <Redirect to="/"/>;
	return (
		<div className="login-page">
			<h2>Connexion</h2>

			<ModalError error={errorModal}/>
			<form onSubmit={handleSubmit}>
				<InputField label="E-mail" type="email" onChange={value => setEmail(value)} required={true}/>
				<InputField label="Mot de passe" type="password" onChange={value => setPassword(value)} required={true}/>
				<InputField type="submit" value="Se connecter"/>
			</form>
		</div>
	);
}

export default withAuth(LogIn, true);