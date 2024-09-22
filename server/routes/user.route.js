import express from "express";
import { signin, signout, signup } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/signin", signin);
userRoute.get("/signout", signout);

export default userRoute;
