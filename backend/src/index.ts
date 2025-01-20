import express from "express";
import sequelize from "./config/database";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/router";
import Users from "./models/Users";

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/users", userRoutes);

// Database Connection
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");

    await sequelize.sync({ alter: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Start Server and Check Database
checkConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
