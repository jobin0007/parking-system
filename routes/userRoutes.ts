import { Router } from "express";
import userController from "../controllers/userController";

const userRoutes: Router = Router();

// Define the registration route
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);


export default userRoutes;
