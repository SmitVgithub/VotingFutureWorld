const path = require('path');
const nodemailer = require('nodemailer');

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HTML escape function to prevent injection
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

module.exports = {
	register: function (req, res, cb) {
		// Validate email format
		const recipientEmail = req.body.email;
		if (!recipientEmail || !EMAIL_REGEX.test(recipientEmail)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Validate election_name exists
		const electionName = req.body.election_name;
		if (!electionName || typeof electionName !== 'string') {
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
		const sanitizedElectionName = escapeHtml(electionName);

		const mailOptions = {
			from: process.env.EMAIL,
			to: recipientEmail,
			subject: sanitizedElectionName + ' Registration',
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
