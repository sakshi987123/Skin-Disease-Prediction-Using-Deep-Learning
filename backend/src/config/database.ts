import mongoose from 'mongoose';
import { config } from './config';

// Type import for mongodb-memory-server — loaded dynamically when needed
type MongoMemoryServerType = {
  start: () => Promise<void>;
  getUri: () => string;
  stop: () => Promise<void>;
};

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.NODE_ENV === 'test' 
      ? config.MONGODB_TEST_URI 
      : config.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options and use modern ones
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DermaCure AI Database)`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error: any) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n❌ DATABASE CONNECTION ERROR:');
      console.error('Could not connect to MongoDB Atlas cluster.');
      console.error('PROBABLE CAUSE: Your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('HOW TO FIX: Log in to Atlas, go to "Network Access", and click "Add Current IP Address".\n');
    } else {
      console.error('Database connection failed:', error);
    }
    // In production or test environments we should exit on DB failure.
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }

    try {
      console.warn('Attempting in-memory MongoDB fallback for development...');

      // Dynamically import to avoid requiring this package in production
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MongoMemoryServer } = require('mongodb-memory-server');

      const mongod = await MongoMemoryServer.create({
        binary: {
          version: '4.4.24'
        }
      });
      const uri = mongod.getUri();
      console.log(`✅ Started in-memory MongoDB at ${uri}`);

      await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      });
      console.log('✅ Connected to in-memory MongoDB (development fallback)');

    } catch (memErr: any) {
      console.warn('Could not start in-memory MongoDB fallback. Some features will remain unavailable.');
      console.warn(memErr?.message || memErr);
    }
  }
};

export default connectDB;
