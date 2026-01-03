import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✓ DB Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("✗ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    const uri = `${process.env.MONGODB_URI}/forever`;
    console.log("Attempting MongoDB connection...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000, // Increased from 10s to 30s
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      w: "majority",
    });

    console.log("✓ MongoDB connected successfully");
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err.message);
    console.error("Make sure:");
    console.error("1. MongoDB Atlas allows your Vercel IP (set to 0.0.0.0/0)");
    console.error("2. MONGODB_URI is set correctly in environment variables");
    console.error("3. Database user has correct permissions");
    throw err; // Re-throw to stop the server if connection fails
  } 
};

export default connectDB;
