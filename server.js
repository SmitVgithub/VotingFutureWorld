const next = require('next');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const voter = require('./routes/voter');
const company = require('./routes/company');
const candidate = require('./routes/candidate');
const mongoose = require('./config/database');
const exp = express();
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Security headers
exp.use(helmet());

// CORS configuration - configure allowed origins for production
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400
};
exp.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});
exp.use(limiter);

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
	exp.use((req, res, next) => {
		if (req.header('x-forwarded-proto') !== 'https') {
			res.redirect(`https://${req.header('host')}${req.url}`);
		} else {
			next();
		}
	});
}

// Body parser with size limits
exp.use(
	express.urlencoded({
		extended: true,
		limit: '10kb'
	})
);
exp.use(express.json({ limit: '10kb' }));

// Trust proxy for rate limiting behind reverse proxy
exp.set('trust proxy', 1);

exp.use('/company', company);

exp.use('/voter', voter);

exp.use('/candidate', candidate);

const app = next({
	dev: process.env.NODE_ENV !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
	const PORT = process.env.PORT || 3000;
	exp.use(handler).listen(PORT, function () {
		console.log(`Node server listening on port ${PORT}`);
	});
});
