import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Users from "./Users";

class Friends extends Model {
  public id!: number;
  public senderfriendId!:number;
  public receiverfriendId!:number;
  public status!: boolean;
  public deleted!: string; // Indicates soft deletion
  public deletedAt!: Date | null; // Timestamp for when the record is soft deleted
}

Friends.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    
      deleted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Set to null if not deleted
      },
    
},{
    sequelize,
    tableName: "Friends",
    timestamps: true, // Automatically add createdAt and updatedAt fields
    paranoid: true, // Enables soft delete (requires deletedAt)
})





export default Friends