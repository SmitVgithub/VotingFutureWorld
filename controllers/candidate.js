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
	return text.toString().replace(/[&<>"']/g, (m) => map[m]);
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
		if (!electionName || typeof electionName !== 'string' || electionName.length > 200) {
			return res.json({ status: 'error', message: 'Invalid election name', data: null });
		}

		const sanitizedElectionName = escapeHtml(electionName);

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
