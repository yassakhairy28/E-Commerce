import { NextFunction, Request, Response } from "express";
import { IError } from "../types/types";

export const globalErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res
    .status(statusCode)
    .json({ message: err.message || "Something went wrong" });
};

export const notFoundHanlder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ message: "Route not found" });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: IError) => next(err));
  };
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
