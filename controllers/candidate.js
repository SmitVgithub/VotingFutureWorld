const path = require('path');
const nodemailer = require('nodemailer');

// HTML entity encoding to prevent injection
function escapeHtml(text) {
	if (!text) return '';
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Basic email validation
function isValidEmail(email) {
	if (!email || typeof email !== 'string') return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && !email.includes('\n') && !email.includes('\r');
}

module.exports = {
	register: function (req, res, cb) {
		// Validate email input
		if (!isValidEmail(req.body.email)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Validate election_name
		if (!req.body.election_name || typeof req.body.election_name !== 'string') {
			return res.json({ status: 'error', message: 'Invalid election name', data: null });
		}

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Sanitize user input for HTML content
		const sanitizedElectionName = escapeHtml(req.body.election_name);

		const mailOptions = {
			from: process.env.EMAIL,
			to: req.body.email,
			subject: req.body.election_name + ' Registration',
			html: 'Congrats you have been registered for ' + sanitizedElectionName + ' election.',
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
