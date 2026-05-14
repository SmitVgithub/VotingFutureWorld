//Set up mongoose connection
const mongoose = require('mongoose');

// Load connection string from environment variable
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

// Connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect with error handling
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
  console.warn('MongoDB disconnected');
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
