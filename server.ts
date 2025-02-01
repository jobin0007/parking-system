import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
import routes from "./routes";

dotenv.config();

const app: Application = express();

// Database Connection Function
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("DB running");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit on failure
  }
};

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use(routes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
