import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/UserSchema";
dotenv.config();

const userController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, email, password, mobile_number } = req.body;


      if (!name || !email || !password || !mobile_number) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }

 
      const userFound: IUser | null = await User.findOne({
        $or: [{ email }, { mobile_number }],
      });

      if (userFound) {
        res.status(400).json({ error: "User already exists." });
        return;
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: IUser = new User({
        name,
        email,
        password: hashedPassword,
        mobile_number,
      });

      await newUser.save();

      
      const token: string = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "2d" } 
      );


      res.cookie("userData", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

  
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
  const { email, password } = req.body;


  if (!email || !password) {
    throw new Error("Please Provide Required Fields");
  }


  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Sorry... User Not Found");
  }


  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error("Password Is Incorrect");
  }

  
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' }
  )


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
