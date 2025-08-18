import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
};
