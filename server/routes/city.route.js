import express from "express";
import verifyUser from "../middleware/userVerify.js";
import {
  createCity,
  deleteCity,
  getAllCity,
  getOneCity,
  getStateCities,
  updateCity,
} from "../controllers/city.controller.js";

const cityRoute = express.Router();

cityRoute.post("/create", verifyUser, createCity);
cityRoute.get("/getAll", verifyUser, getAllCity);
cityRoute.get("/getOne/:cityId", verifyUser, getOneCity);
cityRoute.delete("/delete/:cityId", verifyUser, deleteCity);
cityRoute.put("/update/:cityId", verifyUser, updateCity);
cityRoute.get("/getStateCities/:stateId", verifyUser, getStateCities);

export default cityRoute;
