import { Router } from "express";

import { upload } from "../middleware/multer";
import { JWT } from "../middleware/token";
import { validateUser } from "../middleware/Validate";
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
} from "../controller/usercontroller";
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

export default userRoutes;
