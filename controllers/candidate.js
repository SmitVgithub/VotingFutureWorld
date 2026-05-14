const path = require('path');
var nodemailer = require('nodemailer');

// Helper function to escape HTML entities
function escapeHtml(text) {
	if (!text) return '';
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

// Helper function to sanitize email header values (prevent header injection)
function sanitizeHeaderValue(value) {
	if (!value) return '';
	return String(value).replace(/[\r\n]/g, '');
}

// Helper function to validate email format
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

module.exports = {
	register: function (req, res, cb) {
		// Validate email format
		if (!req.body.email || !isValidEmail(req.body.email)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Sanitize user input for email headers and body
		const sanitizedElectionName = sanitizeHeaderValue(req.body.election_name);
		const escapedElectionName = escapeHtml(req.body.election_name);

		const mailOptions = {
			from: process.env.EMAIL,
			to: req.body.email,
			subject: sanitizedElectionName + ' Registration',
			html: 'Congrats you have been registered for ' + escapedElectionName + ' election.',
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.json({ status: 'error', message: 'mail error', data: null });
				console.log(err);
			} else {
				console.log(info);
				res.json({ status: 'success', message: 'mail sent successfully!!!', data: null });
			}
		});
	},
};
