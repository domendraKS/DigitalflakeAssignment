import express from "express";
import {
  createState,
  deleteState,
  getAllStates,
  getOneState,
  updateState,
} from "../controllers/state.controller.js";
import verifyUser from "../middleware/userVerify.js";

const stateRoute = express.Router();

stateRoute.post("/create", verifyUser, createState);
stateRoute.get("/getAll", verifyUser, getAllStates);
stateRoute.get("/getOne/:stateId", verifyUser, getOneState);
stateRoute.delete("/delete/:stateId", verifyUser, deleteState);
stateRoute.put("/update/:stateId", verifyUser, updateState);

export default stateRoute;
