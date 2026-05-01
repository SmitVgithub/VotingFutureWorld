const VoterModel = require('../models/voter');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const validator = require('validator');
const crypto = require('crypto');

const saltRounds = 10;
const BASE_URL = process.env.BASE_URL || 'https://localhost:3000';

// Helper function to sanitize string input
function sanitizeString(input) {
	if (typeof input !== 'string') {
		return '';
	}
	return validator.escape(input.trim());
}

// Helper function to validate email
function isValidEmail(email) {
	return typeof email === 'string' && validator.isEmail(email);
}

// Helper function to generate secure random password
function generateSecurePassword() {
	return crypto.randomBytes(16).toString('hex');
}

// Helper function to create transporter
function createTransporter() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	});
}

module.exports = {
	create: async function (req, res, cb) {
		try {
			const email = req.body.email;
			const electionAddress = req.body.election_address;
			const electionDescription = req.body.election_description;
			const electionName = req.body.election_name;

			// Input validation
			if (!isValidEmail(email)) {
				return res.json({ status: 'error', message: 'Invalid email address', data: null });
			}

			if (!electionAddress || typeof electionAddress !== 'string') {
				return res.json({ status: 'error', message: 'Invalid election address', data: null });
			}

			const sanitizedEmail = validator.normalizeEmail(email);
			const sanitizedElectionAddress = sanitizeString(electionAddress);
			const sanitizedDescription = sanitizeString(electionDescription || '');
			const sanitizedElectionName = sanitizeString(electionName || '');

			const existingVoter = await VoterModel.findOne({
				email: sanitizedEmail,
				election_address: sanitizedElectionAddress,
			});

			if (existingVoter) {
				return res.json({ status: 'error', message: 'Voter already exists', data: null });
			}

			// Generate secure random password
			const plainPassword = generateSecurePassword();
			const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

			const voter = await VoterModel.create({
				email: sanitizedEmail,
				password: hashedPassword,
				election_address: sanitizedElectionAddress,
			});

			const transporter = createTransporter();

			const mailOptions = {
				from: process.env.EMAIL,
				to: voter.email,
				subject: sanitizedElectionName,
				html:
					sanitizedDescription +
					'<br>Your voting id is: ' +
					voter.email +
					'<br>Your temporary password is: ' +
					plainPassword +
					'<br>Please change your password after first login.' +
					'<br><a href="' + BASE_URL + '/homepage">Click here to visit the website</a>',
			};

			transporter.sendMail(mailOptions, function (err, info) {
				if (err) {
					console.error('Email sending failed');
					return res.json({
						status: 'error',
						message: 'Voter could not be added',
						data: null,
					});
				}
				return res.json({
					status: 'success',
					message: 'Voter added successfully!!!',
					data: null,
				});
			});
		} catch (err) {
			return cb(err);
		}
	},

	authenticate: async function (req, res, cb) {
		try {
			const email = req.body.email;
			const password = req.body.password;

			// Input validation
			if (!isValidEmail(email)) {
				return res.json({ status: 'error', message: 'Invalid email/password!!!', data: null });
			}

			if (!password || typeof password !== 'string') {
				return res.json({ status: 'error', message: 'Invalid email/password!!!', data: null });
			}

			const sanitizedEmail = validator.normalizeEmail(email);

			const voterInfo = await VoterModel.findOne({ email: sanitizedEmail });

			if (!voterInfo) {
				return res.json({ status: 'error', message: 'Invalid email/password!!!', data: null });
			}

			const isPasswordValid = await bcrypt.compare(password, voterInfo.password);

			if (isPasswordValid) {
				return res.json({
					status: 'success',
					message: 'voter found!!!',
					data: { id: voterInfo._id, election_address: voterInfo.election_address },
				});
			} else {
				return res.json({ status: 'error', message: 'Invalid email/password!!!', data: null });
			}
		} catch (err) {
			return cb(err);
		}
	},

	getAll: async function (req, res, cb) {
		try {
			const electionAddress = req.body.election_address;

			if (!electionAddress || typeof electionAddress !== 'string') {
				return res.json({ status: 'error', message: 'Invalid election address', data: null });
			}

			const sanitizedElectionAddress = sanitizeString(electionAddress);

			const voters = await VoterModel.find({ election_address: sanitizedElectionAddress });

			const voterList = voters.map((voter) => ({ id: voter._id, email: voter.email }));

			return res.json({
				status: 'success',
				message: 'voters list found!!!',
				data: { voters: voterList },
				count: voterList.length,
			});
		} catch (err) {
			return cb(err);
		}
	},

	updateById: async function (req, res, cb) {
		try {
			const email = req.body.email;
			const voterId = req.params.voterId;
			const electionDescription = req.body.election_description;
			const electionName = req.body.election_name;

			// Input validation
			if (!isValidEmail(email)) {
				return res.json({ status: 'error', message: 'Invalid email address', data: null });
			}

			if (!voterId || typeof voterId !== 'string') {
				return res.json({ status: 'error', message: 'Invalid voter ID', data: null });
			}

			const sanitizedEmail = validator.normalizeEmail(email);
			const sanitizedDescription = sanitizeString(electionDescription || '');
			const sanitizedElectionName = sanitizeString(electionName || '');

			const existingVoter = await VoterModel.findOne({ email: sanitizedEmail });

			if (existingVoter) {
				return res.json({ status: 'error', message: 'Voter already exists', data: null });
			}

			// Generate secure random password
			const plainPassword = generateSecurePassword();
			const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

			const updatedVoter = await VoterModel.findByIdAndUpdate(
				voterId,
				{ email: sanitizedEmail, password: hashedPassword },
				{ new: true }
			);

			if (!updatedVoter) {
				return res.json({ status: 'error', message: 'Voter not found', data: null });
			}

			const transporter = createTransporter();

			const mailOptions = {
				from: process.env.EMAIL,
				to: updatedVoter.email,
				subject: sanitizedElectionName,
				html:
					sanitizedDescription +
					'<br>Your voting id is: ' +
					updatedVoter.email +
					'<br>Your temporary password is: ' +
					plainPassword +
					'<br>Please change your password after first login.' +
					'<br><a href="' + BASE_URL + '">Click here to visit the website</a>',
			};

			transporter.sendMail(mailOptions, function (err, info) {
				if (err) {
					console.error('Email sending failed');
					return res.json({ status: 'error', message: 'Voter could not be updated', data: null });
				}
				return res.json({
					status: 'success',
					message: 'Voter updated successfully!!!',
					data: null,
				});
			});
		} catch (err) {
			return cb(err);
		}
	},

	deleteById: async function (req, res, cb) {
		try {
			const voterId = req.params.voterId;

			if (!voterId || typeof voterId !== 'string') {
				return res.json({ status: 'error', message: 'Invalid voter ID', data: null });
			}

			await VoterModel.findByIdAndRemove(voterId);

			return res.json({ status: 'success', message: 'voter deleted successfully!!!', data: null });
		} catch (err) {
			return cb(err);
		}
	},

	resultMail: async function (req, res, cb) {
		try {
			const electionAddress = req.body.election_address;
			const electionName = req.body.election_name;
			const winnerCandidate = req.body.winner_candidate;
			const candidateEmail = req.body.candidate_email;

			// Input validation
			if (!electionAddress || typeof electionAddress !== 'string') {
				return res.json({ status: 'error', message: 'Invalid election address', data: null });
			}

			if (!isValidEmail(candidateEmail)) {
				return res.json({ status: 'error', message: 'Invalid candidate email', data: null });
			}

			const sanitizedElectionAddress = sanitizeString(electionAddress);
			const sanitizedElectionName = sanitizeString(electionName || '');
			const sanitizedWinnerCandidate = sanitizeString(winnerCandidate || '');
			const sanitizedCandidateEmail = validator.normalizeEmail(candidateEmail);

			const voters = await VoterModel.find({ election_address: sanitizedElectionAddress });

			const transporter = createTransporter();

			// Send emails to all voters
			const voterEmailPromises = voters.map((voter) => {
				const mailOptions = {
					from: process.env.EMAIL,
					to: voter.email,
					subject: sanitizedElectionName + ' results',
					html:
						'The results of ' +
						sanitizedElectionName +
						' are out.<br>The winner candidate is: <b>' +
						sanitizedWinnerCandidate +
						'</b>.',
				};

				return new Promise((resolve, reject) => {
					transporter.sendMail(mailOptions, (err, info) => {
						if (err) reject(err);
						else resolve(info);
					});
				});
			});

			// Send email to winner
			const winnerMailOptions = {
				from: process.env.EMAIL,
				to: sanitizedCandidateEmail,
				subject: sanitizedElectionName + ' results !!!',
				html: 'Congratulations you won ' + sanitizedElectionName + ' election.',
			};

			const winnerEmailPromise = new Promise((resolve, reject) => {
				transporter.sendMail(winnerMailOptions, (err, info) => {
					if (err) reject(err);
					else resolve(info);
				});
			});

			await Promise.all([...voterEmailPromises, winnerEmailPromise]);

			return res.json({ status: 'success', message: 'mails sent successfully!!!', data: null });
		} catch (err) {
			console.error('Email sending failed');
			return res.json({ status: 'error', message: 'mail error', data: null });
		}
	},
};
