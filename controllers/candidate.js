const path = require('path');
const nodemailer = require('nodemailer');

/**
 * Sanitize string for safe HTML inclusion
 * @param {string} str - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeHtml(str) {
	if (typeof str !== 'string') {
		return '';
	}
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
	if (typeof email !== 'string') {
		return false;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && email.length <= 254;
}

module.exports = {
	register: function (req, res, cb) {
		// Validate email input
		if (!req.body.email || !isValidEmail(req.body.email)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Validate election_name input
		if (!req.body.election_name || typeof req.body.election_name !== 'string') {
			return res.json({ status: 'error', message: 'Invalid election name', data: null });
		}

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const sanitizedElectionName = sanitizeHtml(req.body.election_name);

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: req.body.email,
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
