// Set up mongoose connection
const mongoose = require('mongoose');

// MongoDB connection string from environment variable
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

// Validate that MONGODB_URI is set in production
if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Connection options
const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB with error handling
mongoose.connect(mongoDB, connectionOptions)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Use native promises
mongoose.Promise = global.Promise;

module.exports = mongoose;
