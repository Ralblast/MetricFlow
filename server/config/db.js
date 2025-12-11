import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_URI.replace(/:[^:]*@/, ':***@')); // Hide password
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Wait 30 seconds instead of 10
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;
