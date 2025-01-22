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
import Wave from "../models/Wave";

export const adminSignUp = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
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

export const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the admin exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );
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
    return res
      .status(200)
      .json({ message: "Users retrieved successfully.", users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all waves
export const getAllWaves = async (req: any, res: any) => {
  try {
    const waves = await Waves.findAll(); // Fetch all waves
    return res
      .status(200)
      .json({ message: "Waves retrieved successfully.", waves });
  } catch (error) {
    console.error("Error retrieving waves:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllData = async (req: any, res: any) => {
  try {
    const { id } = req.user;

    // Fetch user details
    const userDetail = await Users.findOne({ where: { id } });

    // Fetch all waves from the database
    const waves = await Wave.findAll();

    // Count active, inactive, and total waves
    const activeCount1 = waves.filter(
      (wave: any) => wave.status === true
    ).length;
    const inactiveCount1 = waves.filter(
      (wave: any) => wave.status === false
    ).length;
    const totalWaves = waves.length;

    // Fetch all users from the database
    const users = await Users.findAll();

    // Count active, inactive, and total users
    const activeCount2 = users.filter(
      (user: any) => user.status === true
    ).length;
    const inactiveCount2 = users.filter(
      (user: any) => user.status === false
    ).length;
    const totalUsers = users.length;

    // Return the counts
    return res.status(200).json({
      activeWaves: activeCount1,
      inactiveWaves: inactiveCount1,
      totalWaves: totalWaves,
      activeUsers: activeCount2,
      inactiveUsers: inactiveCount2,
      totalUsers: totalUsers,
      userDetail: userDetail,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Function to find a user by ID
export const getUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
      const user = await Users.findByPk(id); // Assuming you're using Sequelize

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to update user details
export const editUser = async (req: any, res: any) => {
  const { id } = req?.params;

  try {
      const user = await Users.findByPk(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      await user.update(req?.body ); // Update user details
      res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the current timestamp
    const deletedAt = new Date();

    // Update the user's 'deleted' status and 'deletedAt' timestamp
    await user.update({
      deleted: true,
      deletedAt: deletedAt,
    });

    // Update related records in the 'wave' table
    await Wave.update(
      { 
        deleted: true,
        deletedAt: deletedAt,
      },
      { where: { userId: id } }
    );

    // Update related records in the 'friends' table
    await Friends.update(
      { 
        deleted: true,
        deletedAt: deletedAt,
      },
      {
        where: {
          [Op.or]: [
            { senderFriendId: id },
            { receiverFriendId: id },
          ],
        },
      }
    );

    // Update related records in the 'comments' table
    await Comments.update(
      { 
        deleted: true,
        deletedAt: deletedAt,
      },
      { where: { userId: id } }
    );

    // Update related records in the 'preference' table
    await Preference.update(
      { 
        deleted: true,
        deletedAt: deletedAt,
      },
      { where: { userId: id } }
    );

    res.status(200).json({ message: 'User and related records deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

