const mongoose = require('mongoose');

let memoryServer;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/typeit74';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in production.');
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.warn(`MongoDB unavailable (${error.message}). Starting in-memory database...`);
  }

  if (isProduction) {
    throw new Error('MongoDB connection failed in production. Check MONGO_URI and Atlas network access.');
  }

  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'typeit74',
        ip: '127.0.0.1',
      },
    });
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error starting in-memory MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
