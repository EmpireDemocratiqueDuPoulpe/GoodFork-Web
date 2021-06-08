import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CollapsibleSection.css";

// -- Section states
const POSSIBLE_STATES = ["open", "close"];

const keyOf = sectionName => `${sectionName.toLowerCase()}-section-state`;

const getState = sectionName => {
	const state = localStorage.getItem(keyOf(sectionName));
	return state ? (POSSIBLE_STATES.includes(state) ? state : POSSIBLE_STATES[0]) : null;
};

const setState = (sectionName, state) => {
	localStorage.setItem(keyOf(sectionName), state);
};

// -- Collapsible section
function CollapsibleSection(props) {
	const { title, defaultState } = props;
	let { children } = props;
	const [ currentState, setCurrentState ] = useState(getState(title) ?? defaultState);

	const handleClick = () => {
		const newState = currentState === "open" ? "close" : "open";

		setCurrentState(newState);
		setState(title, newState);
	};

	if (children) {
		if (!Array.isArray(children)) {
			children = [ children ];
		}
	} else children = [];

	return (
		<div className="collapsible-section">
			<div className="cs-header" onClick={handleClick}>
				<div className={`cs-arrow ${currentState}`}/>
				<h3 className="capitalize">{title}</h3>
			</div>

			<div className={`cs-body ${currentState}`}>
				{ children ? (<React.Fragment>{children}</React.Fragment>) : null }
			</div>
		</div>
	);
}

CollapsibleSection.propTypes = {
	title: PropTypes.string.isRequired,
	defaultState: PropTypes.oneOf(POSSIBLE_STATES),
	children: PropTypes.any
};

CollapsibleSection.defaultProps = { defaultState: POSSIBLE_STATES[0] };

export default CollapsibleSection;