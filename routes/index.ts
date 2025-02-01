import express, { Router } from "express";
import userRoutes from "./userRoutes"; // Ensure userRoutes.ts exists

const routes: Router = express.Router();

// Define user-related routes
routes.use("/user", userRoutes);

export default routes;
