import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Users from "./Users";

class Waves extends Model {
  public id!: number;
  public image!: string;
  public video!: string;
  public text!: string;
  public status!: boolean;
  public userId!: number; // for association
  public deleted!: string; // Indicates soft deletion
  public deletedAt!: Date | null; // Timestamp for when the record is soft deleted
}

Waves.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING,
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
    tableName: "Waves",
    timestamps: true, // Automatically add createdAt and updatedAt fields
    paranoid: true, // Enables soft delete (requires deletedAt)
  }
);

export default Waves;
