import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Wave from "./Wave";
import Friends from "./Friends";
import Comments from "./Comments";
import Prefernce from "./Preference";

class Users extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNo!: number;
  public password!: string;
  public addressOne!: string;
  public addressTwo!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public dob!: Date;
  public gender!: string;
  public maritalStatus!: string;
  public socialSecurity!: string;
  public social!: string;
  public kids!: number;
  public profilePhoto!: string;
  public userStatus!: string; // Active/Inactive
  public status!: boolean;
  public deleted!: string; // Indicates soft deletion
  public deletedAt!: Date; // Timestamp for when the record is soft deleted
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
     
    },
    phoneNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressOne: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressTwo: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialSecurity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    social: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kids: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
    paranoid: true, // Enables soft delete
  }
);

// Associations
Users.hasMany(Wave, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Wave.belongsTo(Users, {
  foreignKey: "userId",
  as: "userWave",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(Friends, {
  foreignKey: "senderfriendId",
  as: "sender",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Friends.belongsTo(Users, {
  foreignKey: "senderfriendId",
  as: "sender",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(Friends, {
  foreignKey: "receiverfriendId",
  as: "receiver",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Friends.belongsTo(Users, {
  foreignKey: "receiverfriendId",
  as: "receiver",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(Comments, {
  foreignKey: "userId",
  as: "userComment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comments.belongsTo(Users, {
  foreignKey: "userId",
  as: "userComment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Wave.hasMany(Comments, {
  foreignKey: "waveId",
  as: "waveComment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comments.belongsTo(Wave, {
  foreignKey: "waveId",
  as: "waveComment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(Prefernce, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Prefernce.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Users;
