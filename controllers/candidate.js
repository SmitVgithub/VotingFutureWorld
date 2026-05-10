const path = require('path');
var nodemailer = require('nodemailer');
var validator = require('validator');

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
		// Validate email address
		if (!req.body.email || !validator.isEmail(req.body.email)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Validate election_name exists
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

		// Sanitize user inputs
		const sanitizedEmail = validator.normalizeEmail(req.body.email);
		const sanitizedElectionName = sanitizeInput(req.body.election_name);

		const mailOptions = {
			from: process.env.EMAIL,
			to: sanitizedEmail,
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
