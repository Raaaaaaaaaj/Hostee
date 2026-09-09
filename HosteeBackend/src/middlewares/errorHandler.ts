import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "P2002") {
    statusCode = 409;
    message = `A record with this information already exists. Please provide unique information.`;
  }

  // Handle Invalid JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  // Handle Expired JWT Tokens
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // Send standardized JSON error response
  sendResponse(res, statusCode, message, process.env.NODE_ENV === "development" ? { stack: err.stack } : undefined);
};
