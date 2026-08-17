import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/items.routes.js";
import cartItemRouter from "./routes/cartItem.routes.js";
import orderRouter from "./routes/orders.routes.js";
import addressRouter from "./routes/address.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);
app.use("/api/cartItem", cartItemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/address", addressRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
