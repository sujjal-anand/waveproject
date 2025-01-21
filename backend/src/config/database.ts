import { Sequelize } from "sequelize";
import { Local } from "../env/config";

const DIA: any = Local.DB_Dialect; // bcz of ts issue

const sequelize = new Sequelize(
  Local.DB_Name,
  Local.DB_User,
  Local.DB_Password,
  {
    host: Local.DB_Host,
    dialect: DIA,
  }
);

export default sequelize;
