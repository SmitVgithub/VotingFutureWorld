import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import { Router } from '../routes';
import { Helmet } from 'react-helmet';

class LoginForm extends Component {
	state = {
		election_address: '',
		email: '',
		password: '',
		error: '',
		loading: false,
	};

	validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value, error: '' });
	};

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value, error: '' });
	};

	LoginForm = () => (
		<div className="login-form">
			<style jsx>{`
                .login-form {
                    width:100%;
                    height:100%;
                    position:absolute;
                    background: url('/static/blockchain.jpg') no-repeat;
                } 
              `}</style>

			<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
				<Grid.Column style={{ maxWidth: 380 }}>
					<Form size="large" error={!!this.state.error}>
						<Segment>
							<Header as="h2" color="black" textAlign="center" style={{ marginTop: 10 }}>
								Login
							</Header>
							<Form.Input
								fluid
								icon="user"
								iconPosition="left"
								placeholder="Email"
								style={{ padding: 5 }}
								id="signin_email"
								value={this.state.email}
								onChange={this.handleEmailChange}
								type="email"
								autoComplete="email"
							/>
							<Form.Input
								style={{ padding: 5 }}
								fluid
								id="signin_password"
								icon="lock"
								iconPosition="left"
								placeholder="Password"
								type="password"
								value={this.state.password}
								onChange={this.handlePasswordChange}
								autoComplete="current-password"
							/>
							{this.state.error && (
								<Message error content={this.state.error} />
							)}
							<Button 
								color="blue" 
								fluid 
								size="large" 
								style={{ marginBottom: 15 }} 
								onClick={this.signin}
								loading={this.state.loading}
								disabled={this.state.loading}
							>
								Submit
							</Button>
						</Segment>
					</Form>
				</Grid.Column>
			</Grid>
		</div>
	);

	signin = async (event) => {
		event.preventDefault();
		
		const { email, password } = this.state;
		
		// Input validation
		if (!email || !password) {
			this.setState({ error: 'Please enter both email and password' });
			return;
		}
		
		if (!this.validateEmail(email)) {
			this.setState({ error: 'Please enter a valid email address' });
			return;
		}
		
		if (password.length < 1) {
			this.setState({ error: 'Password is required' });
			return;
		}
		
		this.setState({ loading: true, error: '' });
		
		try {
			const response = await fetch('/voter/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
				credentials: 'same-origin',
			});
			
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			
			const responseObj = await response.json();
			
			if (responseObj.status === 'success') {
				// Set cookies with secure options
				const cookieOptions = {
					secure: window.location.protocol === 'https:',
					sameSite: 'strict',
					expires: 1, // 1 day
				};
				
				Cookies.set('voter_email', encodeURIComponent(email), cookieOptions);
				Cookies.set('address', encodeURIComponent(responseObj.data.election_address), cookieOptions);
				Router.pushRoute(`/election/${encodeURIComponent(responseObj.data.election_address)}/vote`);
			} else {
				this.setState({ error: responseObj.message || 'Authentication failed', loading: false });
			}
		} catch (error) {
			this.setState({ error: 'An error occurred. Please try again.', loading: false });
		}
	};

	render() {
		return (
			<div>
				<link 
					rel="stylesheet" 
					href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" 
					integrity="sha384-JKIDqM48bt14NZpzl9v0AP36v/bJ+wrLCveL8+PTr/4Ayarxq0JcpY0KTHAAKBBg"
					crossOrigin="anonymous"
				/>
				<Helmet>
					<title>Voter login</title>
					<link rel="shortcut icon" type="image/x-icon" href="../../static/logo3.png" />
				</Helmet>
				{this.LoginForm()}
			</div>
		);
	}
}

export default LoginForm;
