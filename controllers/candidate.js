const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');

/**
 * Sanitize string for safe HTML inclusion
 * @param {string} str - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeHtml(str) {
	if (typeof str !== 'string') return '';
	return str
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

		// Validate and sanitize election_name
		const electionName = req.body.election_name;
		if (!electionName || typeof electionName !== 'string') {
			return res.json({ status: 'error', message: 'Invalid election name', data: null });
		}
		const sanitizedElectionName = sanitizeHtml(electionName);

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

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
