import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./HeaderSection.css";

export function SectionItem(props) {
	const { name, link } = props;
	const location = useLocation();
	const content = link
		? <Link to={link}>{name}</Link>
		: <React.Fragment>{name}</React.Fragment>;

	return (
		<li className={`hs-item${link ? " hs-link" : ""}${link && location.pathname === link ? " hs-current-link" : ""}`}>
			{content}
		</li>
	);
}

SectionItem.propTypes = {
	name: PropTypes.string.isRequired,
	link: PropTypes.string
};

function HeaderSection(props) {
	const { title } = props;
	let { children } = props;

	if (children) {
		if (!Array.isArray(children)) {
			children = [ children ];
		}
	} else children = [];

	return (
		<div className="header-section">
			<ul>
				<li className="hs-item hs-title">{title}</li>
				{ children ? (<React.Fragment>{children}</React.Fragment>) : null }
			</ul>
		</div>
	);
}

HeaderSection.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.any
};

export default HeaderSection;