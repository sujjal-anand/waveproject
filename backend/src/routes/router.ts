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
} from "../controller/usercontroller";
import {
  adminLogin,
  adminSignUp,
  editUser,
  getAllData,
  getAllUsers,
  getAllWaves,
  getUser,
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
userRoutes.get("/getUser/:id",getUser)
userRoutes.put("/editUser/:id",editUser)

export default userRoutes;
