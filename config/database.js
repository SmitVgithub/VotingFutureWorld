//Set up mongoose connection
const mongoose = require('mongoose');

// Use environment variable for MongoDB connection string
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

// Validate that MONGODB_URI is set in production
if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable must be set in production');
}

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Handle connection events
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.on('connected', () => {
  console.log('Successfully connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
