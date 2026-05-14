//Set up mongoose connection
const mongoose = require('mongoose');

// Load connection string from environment variable
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI environment variable not set. Using default localhost connection.');
}

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Handle connection events
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

db.on('connected', () => {
  console.log('MongoDB connected successfully');
});

db.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
