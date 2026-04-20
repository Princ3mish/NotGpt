import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB Database connected 🔗")
    );
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "NotGpt",
    });
  } catch (error) {
    console.log("Error connecting to database: " + error.message);
    process.exit(1);
  }
};

export default connectDB;
