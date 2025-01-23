import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Admin extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public status!: boolean;
  public deleted!: string; // Indicates soft deletion (e.g., 'yes'/'no' or 'active'/'deleted')
  public deletedAt!: Date | null; // Timestamp for when the record is soft deleted
}

// Initialize the model
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active", // Can be "active" or "deleted"
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "Admin",
    timestamps: true, // Enables createdAt and updatedAt fields
    paranoid: true, // Enables soft deletion by adding the `deletedAt` field
  }
);

export default Admin;
