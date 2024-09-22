import StateModel from "../models/state.model.js";
import errorHandler from "./../middleware/errorHandler.js";

export const createState = async (req, res, next) => {
  const { stateName, stateCode, status } = req.body;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!stateName || !stateCode) {
    return next(errorHandler(400, "State name or state code cannot empty"));
  }

  try {
    const existStateName = await StateModel.findOne({ stateName });
    if (existStateName) {
      return next(errorHandler(409, "This state name is already have"));
    }

    const existStateCode = await StateModel.findOne({ stateCode });
    if (existStateCode) {
      return next(errorHandler(409, "This state code is already have"));
    }

    const newState = new StateModel({
      stateName,
      stateCode,
      status: status || "Inactive",
    });

    const savedState = await newState.save();

    return res
      .status(201)
      .json({ message: "State created successfully", state: savedState });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getAllStates = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const states = await StateModel.find();
    if (states.length === 0) {
      return next(errorHandler(200, "No state found"));
    }

    return res.status(200).json({ message: "Get states successfully", states });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getOneState = async (req, res, next) => {
  const stateId = req.params.stateId;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const validState = await StateModel.findById(stateId);
    if (!validState) {
      return next(errorHandler(404, "State not found"));
    }

    return res
      .status(200)
      .json({ message: "Get state successfully", state: validState });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteState = async (req, res, next) => {
  const stateId = req.params.stateId;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  try {
    const deletedState = await StateModel.findByIdAndDelete(stateId);
    if (!deletedState) {
      return next(errorHandler(404, "State not found"));
    }

    return res.status(200).json({ message: "State Delete Successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateState = async (req, res, next) => {
  const { stateName, stateCode, status } = req.body;
  const stateId = req.params.stateId;

  if (req.user.role !== "admin") {
    return next(errorHandler(401, "You cannot perform this operation"));
  }

  if (!stateName || !stateCode) {
    return next(errorHandler(400, "State name or state code cannot empty"));
  }

  try {
    const updatedState = await StateModel.findByIdAndUpdate(
      stateId,
      {
        $set: {
          stateName,
          stateCode,
          status: status || "Inactive",
        },
      },
      { new: true }
    );

    if (!updatedState) {
      return next(errorHandler(404, "State not found"));
    }

    return res
      .status(200)
      .json({ message: "State update successfully", state: updatedState });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
