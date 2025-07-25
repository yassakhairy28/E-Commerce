import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB");
  }
};

export default connectDB;
