import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Comments extends Model {
  public id!: number;
  public comment!: string;
  public waveId!: number;
  public userId!: number;
  public status!: boolean;
  public deleted!: string; // Indicates soft deletion
  public deletedAt!: Date | null; // Timestamp for when the record is soft deleted
}

Comments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    deleted: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Comments",
    timestamps: true, // Automatically add createdAt and updatedAt fields
    paranoid: true, // Enables soft delete (requires deletedAt)
  }
);

export default Comments;
