//Set up mongoose connection
const mongoose = require('mongoose');

// Load connection string from environment variable
const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
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

mongoose.Promise = global.Promise;
module.exports = mongoose;
