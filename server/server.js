import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import stateRoute from "./routes/state.route.js";
import cityRoute from "./routes/city.route.js";
import warehouseRoute from "./routes/warehouse.route.js";
import cors from "cors";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

const DB_CONN = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log("Connection failed " + error));
};

app.listen(process.env.PORT, () => {
  DB_CONN();
  console.log("Server started on port " + process.env.PORT);
});

app.use("/api/user", userRoute);
app.use("/api/state", stateRoute);
app.use("/api/city", cityRoute);
app.use("/api/warehouse", warehouseRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({ message });
});
