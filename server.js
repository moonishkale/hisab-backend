import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;

import cors from "cors";
import morgan from "morgan";

//connect MongoDB
import { connectMongoDB } from "./src/config/dbConfig.js";
connectMongoDB();
//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routers
import userRouter from "./src/router/userRouter.js";
//user router to handle the uwer registration and login
app.use("/api/v1/user", userRouter);
//transaction router

//uncaught router
app.use("*", (req, res, next) => {
  const error = {
    errorCode: 404,
    message: "Requested resources not found!",
  };
  next(error);
});
//global error hanlder
app.use((error, req, res, next) => {
  try {
    const errorCode = error.errorCode || 500;

    res.status(errorCode).json({
      status: "error",
      message: error.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
