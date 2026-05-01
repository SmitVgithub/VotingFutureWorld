const next = require('next');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const voter = require('./routes/voter');
const company = require('./routes/company');
const candidate = require('./routes/candidate');
const mongoose = require('./config/database');
const exp = express();

require('dotenv').config({ path: __dirname + '/.env' });

// Logging for database connection errors (use proper logger in production)
mongoose.connection.on('error', (err) => {
	if (process.env.NODE_ENV === 'production') {
		console.error('Database connection error');
	} else {
		console.error('MongoDB connection error:', err);
	}
});

// Security headers
exp.use(helmet());

// CORS configuration - restrict to allowed origins
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
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
	message: 'Too many requests from this IP, please try again later',
	standardHeaders: true,
	legacyHeaders: false,
});
exp.use(limiter);

// Compression
exp.use(compression());

// Body parser with size limits
exp.use(
	express.urlencoded({
		extended: true,
		limit: '10kb'
	})
);
exp.use(express.json({ limit: '10kb' }));

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

// API routes
exp.use('/company', company);
exp.use('/voter', voter);
exp.use('/candidate', candidate);

const app = next({
	dev: process.env.NODE_ENV !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
	// Let Next.js handle all page routing including the homepage
	exp.use(handler);
	
	const PORT = process.env.PORT || 3000;
	exp.listen(PORT, function () {
		console.log(`Node server listening on port ${PORT}`);
	});
});
