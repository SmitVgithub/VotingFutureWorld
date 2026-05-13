//Set up mongoose connection
const mongoose = require('mongoose');

// Use environment variable for MongoDB connection string
// Should include credentials and TLS options in production
// Example: mongodb+srv://user:password@cluster.mongodb.net/BlockVotes?retryWrites=true&w=majority&tls=true
const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

const connectionOptions = {
  // Enable TLS/SSL for encrypted connections (configure based on your MongoDB setup)
  // tls: true,
  // tlsAllowInvalidCertificates: false,
  
  // Connection pool settings
  maxPoolSize: 10,
  
  // Server selection timeout
  serverSelectionTimeoutMS: 5000,
  
  // Socket timeout
  socketTimeoutMS: 45000,
};

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