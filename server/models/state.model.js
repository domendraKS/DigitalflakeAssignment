import mongoose from "mongoose";

const stateSchema = mongoose.Schema(
  {
    stateName: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message:
          "Invalid status value. Only 'Active' or 'Inactive' is allowed.",
      },
      default: "Inactive",
    },
  },
  { timestamps: true }
);

const StateModel = mongoose.model("state", stateSchema);

export default StateModel;
