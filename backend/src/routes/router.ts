import { Router } from "express";

import { upload } from "../middleware/multer";
import { JWT } from "../middleware/token";
import {
  acceptedFriend,
  addFriendLogin,
  addFriendSignup,
  addUserPreference,
  changePassword,
  createWave,
  getFriendsList,
  getUserDetails,
  getUserWaves,
  inviteFriend,
  latestWaves,
  login,
  signUp,
  updateUser,
  updateUserPicture,
  addComment,
  deleteComment,
  getWaveCommentsById,
  editWaveComment,
} from "../controller/usercontroller";
import {
  adminLogin,
  adminSignUp,
  deleteUser,
  deleteWave,
  editUser,
  editWave,
  getAllData,
  getAllUsers,
  getAllWaves,
  getUser,
  getWave,
} from "../controller/admincontroller";
const userRoutes = Router();

userRoutes.post("/signUp", signUp);
userRoutes.post("/login", login);
userRoutes.post("/inviteFriend", JWT, inviteFriend);
userRoutes.post("/addFriendLogin", JWT, addFriendLogin);
userRoutes.post("/addFriendSignup", JWT, addFriendSignup);
userRoutes.get("/getUserDetails", JWT, getUserDetails);
userRoutes.post("/createWave", upload.single("media"), JWT, createWave);
userRoutes.put("/changePassword", JWT, changePassword);
userRoutes.put("/updateUser", JWT, updateUser);
userRoutes.get("/latestWaves", JWT, latestWaves);
userRoutes.get("/getFriendsList", JWT, getFriendsList);
userRoutes.put("/addUserPreference", JWT, addUserPreference);
userRoutes.put(
  "/updateUserPicture",
  upload.single("profilePhoto"),
  JWT,
  updateUserPicture
);
userRoutes.get("/getAcceptedFriends", JWT, acceptedFriend);
userRoutes.get("/getUserWaves", JWT, getUserWaves);
userRoutes.put("/addComment", JWT, addComment);

//admin
userRoutes.post("/adminSignup", adminSignUp);
userRoutes.post("/adminLogin", adminLogin);
userRoutes.get("/getAllData", JWT, getAllData);
userRoutes.get("/getAllUsers", getAllUsers);
userRoutes.get("/getAllWaves", getAllWaves);
userRoutes.get("/getUser/:id", getUser);
userRoutes.get("/getWave/:id", getWave);
userRoutes.put("/editUser/:id", editUser);
userRoutes.delete("/deleteUser/:id", deleteUser);
userRoutes.put("/editWave/:id", upload.single("media"), editWave);
userRoutes.delete("/deleteWave/:id", deleteWave);
userRoutes.delete("/deleteComment/:id", deleteComment);

userRoutes.get("/getWaveCommentsById/:id", getWaveCommentsById);
userRoutes.put("/editComment/:id", editWaveComment);

export default userRoutes;
