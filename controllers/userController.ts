import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs"; // Use bcryptjs for better support
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/User"; // Ensur // Ensure IUser is defined in User model

dotenv.config();

const userController = {
  register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, mobile_number } = req.body;

      // Validate required fields
      if (!name || !email || !password || !mobile_number) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }

      // Check if user already exists (by email or mobile number)
      const userFound: IUser | null = await User.findOne({
        $or: [{ email }, { mobile_number }],
      });

      if (userFound) {
        res.status(400).json({ error: "User already exists." });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser: IUser = new User({
        name,
        email,
        password: hashedPassword,
        mobile_number,
      });

      await newUser.save();

      // Generate JWT Token
      const token: string = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "2d" } // Token expires in 2 days
      );

      // Set secure HTTP-only cookie
      res.cookie("userData", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Send response
      res.status(201).json({
        message: "User registration successful",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Error in user registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }),



 login : asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    throw new Error("Please Provide Required Fields");
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Sorry... User Not Found");
  }

  // Compare the provided password with the hashed password
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error("Password Is Incorrect");
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '4h' }
  );

  // Set the token in a cookie
  res.cookie('token', token, {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    httpOnly: true,
    secure: false, // Change to true if using HTTPS
    sameSite: 'none',
  });

  // Send the response
  res.json({
    message: 'Login Successful',
    token,
  });
})



};

export default userController;
