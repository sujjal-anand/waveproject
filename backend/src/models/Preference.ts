import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Users from "./Users";

class Prefernce extends Model {
  public id!: number;
  public language!: string;
  public breakfast!: string;
  public lunch!: string;
  public dinner!: string;
  public wakeTime!: string;
  public bedTime!: string;
  public weightIn!: string;
  public weight!: string;
  public heightIn!: string;
  public height!: string;
  public bloodGlucoseIn!: string;
  public bloodGlucose!: string;
  public cholesterolIn!: string;
  public cholesterol!: string;
  public bloodPressureIn!: string;
  public bloodPressure!: string;
  public distanceIn!: string;
  public distance!: string;
  public systemEmail!: boolean;
  public sms!: boolean;
  public post!: boolean;
  public memberServicesEmail!: boolean;
  public phoneCall!: boolean;
  public userId!: string; // Foreign key to the Users model
  public status!: boolean;
  public deleted!: string; // Indicates soft deletion
  public deletedAt!: Date | null; // Timestamp for soft deletion
}

// Initialize the Prefernce model
Prefernce.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breakfast: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lunch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dinner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wakeTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bedTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weightIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heightIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGlucoseIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodGlucose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cholesterolIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cholesterol: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodPressureIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distanceIn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    systemEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    memberServicesEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    phoneCall: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Prefernce",
    timestamps: true,
    paranoid: true, // Enables soft delete functionality
  }
);

// Define associations

export default Prefernce;
