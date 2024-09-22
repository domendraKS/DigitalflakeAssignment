import errorHandler from "../middleware/errorHandler.js";
import CityModel from "../models/city.model.js";
import StateModel from "../models/state.model.js";

export const createCity = async (req, res, next) => {
  const { cityName, cityCode, status, stateId } = req.body;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!cityName || !cityCode || !stateId) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    const validState = await StateModel.findById(stateId);
    if (!validState) {
      return next(errorHandler(404, "State not found"));
    }

    const existCityName = await CityModel.findOne({ cityName });
    if (existCityName) {
      return next(errorHandler(409, "City name is already exist"));
    }

    const existCityCode = await CityModel.findOne({ cityCode });
    if (existCityCode) {
      return next(errorHandler(409, "City code already exist"));
    }

    const newCity = new CityModel({
      cityName,
      cityCode,
      status: status || "Inactive",
      stateId,
    });

    const savedCity = await newCity.save();

    const populatedCity = await CityModel.findById(savedCity._id).populate(
      "stateId",
      "stateName _id stateCode status"
    );

    return res
      .status(201)
      .json({ message: "City created successfully", city: populatedCity });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getAllCity = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const cities = await CityModel.find().populate(
      "stateId",
      "stateName _id stateCode status"
    );
    if (cities.length === 0) {
      return next(errorHandler(404, "No city found"));
    }

    return res
      .status(200)
      .json({ message: "Get all cities successful", cities });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getOneCity = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const city = await CityModel.findById(req.params.cityId).populate(
      "stateId",
      "stateName _id stateCode status"
    );

    if (!city) {
      return next(errorHandler(404, "City not found"));
    }

    return res.status(200).json({ message: "Get all cities successful", city });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteCity = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const deletedCity = await CityModel.findByIdAndDelete(req.params.cityId);
    if (!deletedCity) {
      return next(errorHandler(404, "City not found"));
    }

    return res.status(200).json({ message: "City delete successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateCity = async (req, res, next) => {
  const { cityName, cityCode, status, stateId } = req.body;
  const cityId = req.params.cityId;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!cityName || !cityCode || !stateId) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    const updatedCity = await CityModel.findByIdAndUpdate(
      cityId,
      {
        $set: {
          cityName,
          cityCode,
          status: status || "Inactive",
          stateId,
        },
      },
      { new: true }
    );

    if (!updatedCity) {
      return next(errorHandler(404, "City not found"));
    }

    return res
      .status(200)
      .json({ message: "City update successfully", city: updatedCity });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getStateCities = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const validState = await StateModel.findById(req.params.stateId);
    if (!validState) {
      return next(errorHandler(404, "State not found"));
    }

    const cities = await CityModel.find({
      stateId: req.params.stateId,
    }).populate("stateId", "stateName _id stateCode status");

    if (cities.length === 0) {
      return next(errorHandler(404, "No cities found for the specified state"));
    }

    return res
      .status(200)
      .json({ message: "Get all cities successful", cities });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
