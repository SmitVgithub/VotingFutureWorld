import React from 'react';
import { Menu } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

// Helper function to safely get and sanitize cookie values
const getSanitizedEmail = () => {
	const email = Cookies.get('company_email') || Cookies.get('voter_email') || '';
	// Basic email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (email && emailRegex.test(email)) {
		return DOMPurify.sanitize(email);
	}
	return '';
};

export default props => {
	return (
		<div className="header">
			<style jsx>{`
				.header {
					z-index: 10;
				}
			`}</style>
			<Menu secondary style={{ maxHeight: '50px' }}>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
					integrity="sha384-JKIDqM48bt14NZpzl9v0AP36v/j5xT+N0rZvL5HvNMjW/bDPSDTzM0gL+PjLov7y"
					crossOrigin="anonymous"
				/>
				<Menu.Item
					name="BlockVotes"
					style={{ verticalAlign: 'middle', fontSize: '40px', paddingLeft: '42%', paddingTop: '4%' }}
				/>
				<Menu.Menu position="right">
					<Menu.Item icon="user" />
					<Menu.Item style={{ paddingRight: '10px' }}>
						{getSanitizedEmail()}
					</Menu.Item>
				</Menu.Menu>
			</Menu>
			<hr />
			{props.children}
		</div>
	);
};
