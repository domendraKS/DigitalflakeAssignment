import mongoose from "mongoose";

const citySchema = mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
    cityCode: {
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
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "state",
      required: true,
    },
  },
  { timestamps: true }
);

const CityModel = mongoose.model("city", citySchema);

export default CityModel;
