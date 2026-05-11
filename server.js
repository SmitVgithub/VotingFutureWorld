const next = require('next');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const voter = require('./routes/voter');
const company = require('./routes/company');
const candidate = require('./routes/candidate');
const bodyParser = require('body-parser');
const mongoose = require('./config/database');
const exp = express();
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Security middleware - Helmet for secure HTTP headers
exp.use(helmet());

// CORS configuration with specific origins
const corsOptions = {
	origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
};
exp.use(cors(corsOptions));

// Rate limiting to prevent brute force and DoS attacks
const limiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false
});
exp.use(limiter);

exp.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
exp.use(bodyParser.json());
exp.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'pages', 'homepage.js'));
});

exp.use('/company', company);

exp.use('/voter', voter);

exp.use('/candidate', candidate);

const app = next({
	dev: process.env.NODE_ENV !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
	exp.use(handler).listen(PORT, function () {
		console.log(`Node server listening on port ${PORT}`);
	});
});
