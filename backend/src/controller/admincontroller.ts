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
import { date, preferences } from "joi";
const jwtKey = Local.Secret_Key;

import Admin from "../models/Admin"; // Replace with your actual Admin model import

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
      jwtKey
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
    const { search } = req.query;

    // Query conditions
    const whereCondition: any = {};

    // Add search condition if 'search' is provided
    if (search) {
      whereCondition[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Fetch users
    const users = await Users.findAll({
      where: whereCondition,
      attributes: { exclude: ["password"] }, // Optional: exclude sensitive data
    });

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
    const { search } = req.query;

    // Define a search condition specifically for users
    const searchCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Fetch waves with associated users, applying user search condition
    const waves = await Waves.findAll({
      include: [
        {
          model: Users,
          as: "userWave",
          where: searchCondition, // Apply search condition to associated users
          required: search ? true : false, // Use inner join if searching, else left join
        },
      ],
    });

    return res.status(200).json({
      message: "Waves with associated Users retrieved successfully.",
      waves,
    });
  } catch (error) {
    console.error("Error retrieving waves with users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllData = async (req: any, res: any) => {
  try {
    const { id } = req.user;

    // Fetch user details (only non-deleted users)
    const userDetail = await Users.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    // Fetch active and total waves with precise Sequelize conditions
    const wavesData = await Waves.findAndCountAll({
      where: {
        deletedAt: null,
        status: {
          [Op.or]: [true, false], // Include both active and inactive waves
        },
      },
      attributes: ["id", "status"], // Only fetch necessary attributes
    });

    // Fetch active and total users with precise Sequelize conditions
    const usersData = await Users.findAndCountAll({
      where: {
        deletedAt: null,
        status: {
          [Op.or]: [true, false], // Include both active and inactive users
        },
      },
      attributes: ["id", "status"], // Only fetch necessary attributes
    });

    // Count waves by status
    const activeWaves = wavesData.rows.filter(
      (wave: any) => wave.status === true
    ).length;
    const inactiveWaves = wavesData.rows.filter(
      (wave: any) => wave.status === false
    ).length;

    // Count users by status
    const activeUsers = usersData.rows.filter(
      (user: any) => user.status === true
    ).length;
    const inactiveUsers = usersData.rows.filter(
      (user: any) => user.status === false
    ).length;

    return res.status(200).json({
      activeWaves,
      inactiveWaves,
      totalWaves: wavesData.count,
      activeUsers,
      inactiveUsers,
      totalUsers: usersData.count,
      userDetail,
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
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update user details
export const editUser = async (req: any, res: any) => {
  const { id } = req?.params;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(req?.body); // Update user details
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editWave = async (req: any, res: any) => {
  const { id } = req.params;
  const { text } = req.body; // Extract text from the request body
  const media = req.file; // Extract the uploaded file from req.file

  try {
    // Find the wave by ID
    const wave = await Waves.findOne({ where: { id } });
    if (!wave) {
      return res.status(404).json({ message: "Wave not found" });
    }

    // Update the text field if provided
    if (text) {
      await wave.update({ text });
    }

    // Handle media file upload
    if (media) {
      if (media.mimetype === "video/mp4") {
        // Update video column and nullify the image column
        await wave.update({
          video: media.path, // Store the video path
          image: null, // Nullify the image field
        });
      } else if (media.mimetype === "image/jpeg") {
        // Update image column and nullify the video column
        await wave.update({
          image: media.path, // Store the image path
          video: null, // Nullify the video field
        });
      } else {
        return res
          .status(400)
          .json({ error: "Only MP4 and JPG files are allowed." });
      }
    }

    // Fetch the updated wave for the response
    const updatedWave = await Waves.findOne({ where: { id } });

    return res
      .status(200)
      .json({ message: "Wave updated successfully", wave: updatedWave });
  } catch (error) {
    console.error("Error updating wave:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destroy the user (this will trigger the soft delete because of 'paranoid: true')
    await user.destroy();

    // Destroy related records in the 'waves' table
    await Waves.destroy({
      where: { userId: id },
    });

    // Destroy related records in the 'friends' table
    await Friends.destroy({
      where: {
        [Op.or]: [{ senderFriendId: id }, { receiverFriendId: id }],
      },
    });

    // Destroy related records in the 'comments' table
    await Comments.destroy({
      where: { userId: id },
    });

    // Destroy related records in the 'preference' table
    await Preference.destroy({
      where: { userId: id },
    });

    // Send a response indicating that the deletion was successful
    res
      .status(200)
      .json({ message: "User and related records deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWave = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const wave = await Waves.findByPk(id, {
      include: [
        {
          model: Users, // Assuming Users is the related model
          as: "userWave", // Make sure this alias matches the one you have in the association
        },
      ],
    });
    if (!wave) {
      return res.status(404).json({ message: "Wave not found" });
    }

    res.status(200).json(wave);
  } catch (error) {
    console.error("Error finding Wave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWave = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const wave = await Waves.findByPk(id);

    if (!wave) {
      return res.status(404).json({ message: "wave not found" });
    }

    // Destroy the user (this will trigger the soft delete because of 'paranoid: true')

    // Destroy related records in the 'waves' table
    await wave.destroy();

    // Destroy related records in the 'comments' table
    await Comments.destroy({
      where: { waveId: id },
    });

    // Destroy related records in the 'preference' table

    // Send a response indicating that the deletion was successful
    res
      .status(200)
      .json({ message: "User and related records deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
