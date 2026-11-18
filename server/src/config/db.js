import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose.
 * Implements clean connection handling and diagnostic messages
 * suitable for both local development and cloud (MongoDB Atlas) environments.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vishwas_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn(`[Database Hint] Ensure local MongoDB is running at ${mongoURI} or provide a MongoDB Atlas URI in server/.env`);
    return false;
  }
};

/**
 * Returns true if mongoose is currently connected to MongoDB.
 */
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};
