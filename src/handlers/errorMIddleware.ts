import { NextFunction, ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log("you have an error ");
  console.log(err);

  return res.status(err.status || 500).json({ err });
};

export default errorMiddleware;
