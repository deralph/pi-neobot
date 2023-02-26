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
// import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import env from "./environments";
import mountPaymentsEndpoints from "./handlers/payments";
import mountUserEndpoints from "./handlers/users";

// We must import typedefs for ts-node-dev to pick them up when they change (even though tsc would supposedly
// have no problem here)
// https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata#comment125163548_65381085
import "./types/session";
import answer from "./chatGpt/chat";
import connectDB from "./connectDB";
import errorMiddleware from "./handlers/errorMIddleware";

// const dbName = env.mongo_db_name;
// const mongoUri = `mongodb://${env.mongo_host}/${dbName}`;
// const mongoClientOptions = {
//   authSource: "admin",
//   auth: {
//     username: env.mongo_user,
//     password: env.mongo_password,
//   },
// }

//
// I. Initialize and set up the express app and various middlewares and packages:
//

const app: express.Application = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

// Log requests to the console in a compact format:
app.use(logger("dev"));

// Full log of all requests to /log/access.log:
app.use(
  logger("common", {
    stream: fs.createWriteStream(
      path.join(__dirname, "..", "log", "access.log"),
      { flags: "a" }
    ),
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

//  Use sessions:
// app.use(session({
//   secret: env.session_secret,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: mongoUri,
//     mongoOptions: mongoClientOptions,
//     dbName: dbName,
//     collectionName: 'user_sessions'
//   }),
// }));

//
// II. Mount app endpoints:
//

// Payments endpoint under /payments:
const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use("/payments", paymentsRouter);

// User endpoints (e.g signin, signout) under /user:
const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use("/user", userRouter);

app.post("/generate-output", answer);

// Hello World page to check everything works:
// app.get("/", async (_, res) => {
//   res.status(200).send({ message: "Hello, World!" });
// });

app.use(errorMiddleware);

// III. Boot up the app:

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log(mongoUri, "ok");
    await connectDB(mongoUri!);
    console.log("inside db");
    var date = new Date(
      new Date().setDate(new Date().getDate() + 30)
    ).toLocaleDateString();
    console.log(date);
    const date1 = new Date().toLocaleDateString();
    console.log(date1);
    console.log(new Date(date) > new Date(date1));
    app.listen(port, () => console.log(`server listening at port ${port}`));
    console.log(path.resolve(__dirname, "../client/build"));
  } catch (error) {
    console.log("connect error");
    console.log(error);
  }
};

start();
