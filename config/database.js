//Set up mongoose connection
const mongoose = require('mongoose');

// Load environment variables (ensure dotenv is configured in main app)
const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: process.env.MONGODB_SSL === 'true',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
};

// Only add SSL cert options if in production
if (process.env.NODE_ENV === 'production') {
  connectionOptions.ssl = true;
  // Optionally add CA certificate for production
  // connectionOptions.sslCA = process.env.MONGODB_CA_CERT;
}

mongoose.connect(mongoDB, connectionOptions)
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
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.Promise = global.Promise;
module.exports = mongoose;
