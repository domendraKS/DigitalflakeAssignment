import express from "express";
import verifyUser from "../middleware/userVerify.js";
import {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouse,
  getOneWarehouse,
  updateWarehouse,
} from "../controllers/warehouse.controller.js";

const warehouseRoute = express.Router();

warehouseRoute.post("/create", verifyUser, createWarehouse);
warehouseRoute.get("/getAll", verifyUser, getAllWarehouse);
warehouseRoute.get("/getOne/:warehouseId", verifyUser, getOneWarehouse);
warehouseRoute.delete("/delete/:warehouseId", verifyUser, deleteWarehouse);
warehouseRoute.put("/update/:warehouseId", verifyUser, updateWarehouse);

export default warehouseRoute;
