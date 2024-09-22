import mongoose from "mongoose";

const warehouesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
    required: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["Active", "Inactive"],
      message: "Invalid status value. Only 'Active' or 'Inactive' is allowed.",
    },
    default: "Inactive",
  },
});

const WarehouseModel = mongoose.model("warehouse", warehouesSchema);

export default WarehouseModel;
