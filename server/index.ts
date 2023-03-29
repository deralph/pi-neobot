import { config } from "dotenv";
config();

import "express-async-errors";

import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import logger from "morgan";
import env from "./environments";
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";

import "./types/session";
import answer from "./chatGpt/chat";
import connectDB from "./connectDB";
import errorMiddleware from "./handlers/errorMIddleware";
import { checkInvoice, createUser, subscribeUser } from "./handlers/testdb";
import MongoStore from "connect-mongo";

const app: express.Application = express();

// for hosting
// if (process.env.NODE_ENV === "production") {
//   app.use("/", express.static("../build"));

//   app.get("*", (req, res) => {
// res.sendFile(path.join(__dirname, "..", "build", "index.html"));
//   });
// }

// // for local
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Log requests to the console in a compact format:
app.use(logger("dev"));

// Full log of all requests to /log/access.log:
app.use(
  logger("common", {
    stream: fs.createWriteStream(path.join(__dirname, "log", "access.log"), {
      flags: "a",
    }),
  })
);

// Enable response bodies to be sent as JSON:
app.use(express.json());

// Handle CORS:
app.use(
  cors({
    origin: env.frontend_url,
    credentials: true,
  })
);

// Handle cookies 🍪
app.use(cookieParser());

const mongoUri = process.env.MONGO_URI;
//  Use sessions:
app.use(
  session({
    secret: env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "user_sessions",
    }),
  })
);

// II. Mount app endpoints:

// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

// testingdb
app.use("/check-user", createUser);
app.use("/subscribe-user", subscribeUser);

// generate answer endpoint
app.post("/generate-output", answer);
app.post("/chack-paid", checkInvoice);

app.use(errorMiddleware);

// III. Boot up the app:

const port = process.env.PORT || 9001;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`server listening at port ${port}`));
  } catch (error) {
    console.log("connect error");
    console.log(error);
  }
};

start();
