//Set up mongoose connection
const mongoose = require('mongoose');

// Load connection string from environment variable
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

// Connect with updated options and error handling
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
