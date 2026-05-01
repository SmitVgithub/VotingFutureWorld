//Set up mongoose connection
const mongoose = require('mongoose');

// Load environment variables (ensure dotenv is configured in main app)
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/BlockVotes';

// Connection options with security best practices
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Enable SSL/TLS in production
  ssl: process.env.NODE_ENV === 'production',
  // Connection pool settings
  maxPoolSize: 10,
  // Server selection timeout
  serverSelectionTimeoutMS: 5000,
  // Socket timeout
  socketTimeoutMS: 45000,
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
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
