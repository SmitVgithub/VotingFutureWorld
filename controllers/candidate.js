const path = require('path');
var nodemailer = require('nodemailer');
var validator = require('validator');

/**
 * Escape HTML special characters to prevent injection
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
	if (!text || typeof text !== 'string') return '';
	return text
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
		if (!recipientEmail || !validator.isEmail(recipientEmail)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Sanitize election name to prevent HTML injection
		const electionName = escapeHtml(req.body.election_name);
		if (!electionName) {
			return res.json({ status: 'error', message: 'Election name is required', data: null });
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
			html: 'Congrats you have been registered for ' + electionName + ' election.',
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
