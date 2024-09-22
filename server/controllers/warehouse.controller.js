import errorHandler from "../middleware/errorHandler.js";
import CityModel from "../models/city.model.js";
import StateModel from "../models/state.model.js";
import WarehouseModel from "./../models/warehouse.model.js";

export const createWarehouse = async (req, res, next) => {
  const { name, stateId, cityId, status } = req.body;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!name || !stateId || !cityId) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    const existWarehouse = await WarehouseModel.findOne({ name });
    if (existWarehouse) {
      return next(errorHandler(409, "Warehouse name is already exist"));
    }

    const validState = await StateModel.findById(stateId);
    if (!validState) {
      return next(errorHandler(404, "State not found"));
    }

    const validCity = await CityModel.findById(cityId);
    if (!validCity) {
      return next(errorHandler(404, "City not found"));
    }

    if (validCity.stateId.toString() !== stateId) {
      return next(
        errorHandler(400, "City does not belong to the specified state")
      );
    }

    const newWarehouse = new WarehouseModel({
      name,
      stateId,
      cityId,
      status: status || "Inactive",
    });

    const savedWarehouse = await newWarehouse.save();

    const populatedWarehouse = await WarehouseModel.findById(savedWarehouse._id)
      .populate("stateId", "stateName _id stateCode status")
      .populate("cityId", "cityName _id cityCode status");

    return res.status(201).json({
      message: "Warehouse created successfully",
      warehouse: populatedWarehouse,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateWarehouse = async (req, res, next) => {
  const { name, stateId, cityId, status } = req.body;
  const warehouseId = req.params.warehouseId;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!name || !stateId || !cityId) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    const validState = await StateModel.findById(stateId);
    if (!validState) {
      return next(errorHandler(404, "State not found"));
    }

    const validCity = await CityModel.findById(cityId);
    if (!validCity) {
      return next(errorHandler(404, "City not found"));
    }

    if (validCity.stateId.toString() !== stateId) {
      return next(
        errorHandler(400, "City does not belong to the specified state")
      );
    }

    const updatedWarehouse = await WarehouseModel.findByIdAndUpdate(
      warehouseId,
      {
        $set: {
          name,
          stateId,
          cityId,
          status: status || "Inactive",
        },
      },
      { new: true }
    );

    if (!updatedWarehouse) {
      return next(errorHandler(404, "Warehouse not found"));
    }

    const populatedWarehouse = await WarehouseModel.findById(
      updatedWarehouse._id
    )
      .populate("stateId", "stateName _id stateCode status")
      .populate("cityId", "cityName _id cityCode status");

    return res.status(200).json({
      message: "Warehouse updated successfully",
      warehouse: populatedWarehouse,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getAllWarehouse = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const warehouses = await WarehouseModel.find()
      .populate("stateId", "stateName _id stateCode status")
      .populate("cityId", "cityName _id cityCode status");

    if (warehouses.length === 0) {
      return next(errorHandler(200, "No warehouse found"));
    }

    return res
      .status(200)
      .json({ message: "Get warehouses successfully", warehouses });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getOneWarehouse = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const warehouse = await WarehouseModel.findById(req.params.warehouseId)
      .populate("stateId", "stateName _id stateCode status")
      .populate("cityId", "cityName _id cityCode status");

    if (!warehouse) {
      return next(errorHandler(404, "Warehouse not found"));
    }

    return res
      .status(200)
      .json({ message: "Get warehouse successfully", warehouse });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteWarehouse = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const warehouse = await WarehouseModel.findByIdAndDelete(
      req.params.warehouseId
    );

    if (!warehouse) {
      return next(errorHandler(404, "Warehouse not found"));
    }

    return res.status(200).json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
