const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');

/**
 * Sanitize string input to prevent injection attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
	if (typeof input !== 'string') {
		return '';
	}
	// Remove newlines to prevent header injection
	// Escape HTML entities to prevent HTML injection
	return input
		.replace(/[\r\n]/g, '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

module.exports = {
	register: function (req, res, cb) {
		// Validate email input
		const recipientEmail = req.body.email;
		if (!recipientEmail || !validator.isEmail(recipientEmail)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Sanitize user inputs
		const sanitizedElectionName = sanitizeInput(req.body.election_name);

		if (!sanitizedElectionName) {
			return res.json({ status: 'error', message: 'Invalid election name', data: null });
		}

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL,
			to: validator.normalizeEmail(recipientEmail),
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
