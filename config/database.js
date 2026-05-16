//Set up mongoose connection
const mongoose = require('mongoose');

// Load connection string from environment variable
const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(mongoDB)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
