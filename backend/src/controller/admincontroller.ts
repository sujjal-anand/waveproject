import { Local } from "../env/config";
import { transporter } from "../middleware/mailer";
import Friends from "../models/Friends";
import Users from "../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";
import Waves from "../models/Wave";
import Comments from "../models/Comments";
import Prefernce from "../models/Preference";
import Preference from "../models/Preference";
import { preferences } from "joi";
const jwtKey = Local.Secret_Key;


import Admin from "../models/Admin"; // Replace with your actual Admin model import

export const signUp = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the Admin record
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    // Respond with success
    return res.status(201).json({
      message: "Admin account created successfully.",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error during admin signup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const login = async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      // Check if the admin exists
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (!existingAdmin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password." });
      }
  
      // Create a JWT token
      const token = jwt.sign(
        {
          id: existingAdmin.id,
          email: existingAdmin.email,
        },
        jwtKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
  
      // Respond with the token and user details
      return res.status(200).json({
        message: "Login successful.",
        admin: {
          id: existingAdmin.id,
          email: existingAdmin.email,
        },
        token,
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

// Get all users
export const getAllUsers = async (req: any, res: any) => {
    try {
      const users = await Users.findAll(); // Fetch all users
      return res.status(200).json({ message: "Users retrieved successfully.", users });
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  
  // Get all waves
  export const getAllWaves = async (req: any, res: any) => {
    try {
      const waves = await Waves.findAll(); // Fetch all waves
      return res.status(200).json({ message: "Waves retrieved successfully.", waves });
    } catch (error) {
      console.error("Error retrieving waves:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };