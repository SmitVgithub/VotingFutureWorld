const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');

// Email validation helper
function isValidEmail(email) {
	return email && typeof email === 'string' && validator.isEmail(email);
}

// Sanitize string input
function sanitizeInput(input) {
	if (!input || typeof input !== 'string') {
		return '';
	}
	// Remove potentially dangerous characters and limit length
	return validator.escape(input.trim()).substring(0, 200);
}

module.exports = {
	register: function (req, res, cb) {
		// Validate required environment variables
		if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
			console.error('Email configuration missing');
			return res.status(500).json({ status: 'error', message: 'Server configuration error', data: null });
		}

		// Validate email input
		const recipientEmail = req.body.email;
		if (!isValidEmail(recipientEmail)) {
			return res.status(400).json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Validate and sanitize election name
		const electionName = sanitizeInput(req.body.election_name);
		if (!electionName) {
			return res.status(400).json({ status: 'error', message: 'Invalid election name', data: null });
		}

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL,
			to: recipientEmail,
			subject: electionName + ' Registration',
			text: 'Congrats you have been registered for ' + electionName + ' election.',
			html: '<p>Congrats you have been registered for <strong>' + electionName + '</strong> election.</p>',
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				console.error('Mail error:', err.message);
				return res.status(500).json({ status: 'error', message: 'Failed to send email', data: null });
			}
			console.log('Mail sent:', info.messageId);
			return res.json({ status: 'success', message: 'Mail sent successfully!', data: null });
		});
	},
};
