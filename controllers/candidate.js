const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');

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
		// Validate email input
		const recipientEmail = req.body.email;
		if (!recipientEmail || !validator.isEmail(recipientEmail)) {
			return res.json({ status: 'error', message: 'Invalid email address', data: null });
		}

		// Sanitize election name to prevent HTML injection
		const electionName = escapeHtml(req.body.election_name);

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
