import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });

    const uri = `${process.env.MONGODB_URI}/forever`;
    console.log(
      "Connecting to MongoDB host:",
      uri.replace(/\/\/.+@/, "//<redacted>@")
    );

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connectDB;
