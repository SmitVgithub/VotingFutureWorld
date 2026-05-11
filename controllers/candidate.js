const path = require('path');
var nodemailer = require('nodemailer');

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitizes string to prevent email header injection
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeForEmailHeader(input) {
	if (typeof input !== 'string') return '';
	// Remove newlines and carriage returns to prevent header injection
	return input.replace(/[\r\n]/g, '').trim();
}

/**
 * Escapes HTML special characters to prevent HTML injection
 * @param {string} input - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(input) {
	if (typeof input !== 'string') return '';
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

module.exports = {
	register: function (req, res, cb) {
		// Validate email input
		const recipientEmail = req.body.email;
		if (!recipientEmail || !isValidEmail(recipientEmail)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Sanitize election name for header and escape for HTML body
		const electionName = sanitizeForEmailHeader(req.body.election_name || '');
		const electionNameHtml = escapeHtml(electionName);

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
			html: 'Congrats you have been registered for ' + electionNameHtml + ' election.',
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
