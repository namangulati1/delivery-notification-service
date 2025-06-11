import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger'; // Assuming your Winston logger is here

// Define a base AppError class for custom operational errors if you don't have one
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}
// Specific error types (examples)
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error', public errors?: any) {
    super(message, 422); // Unprocessable Entity
  }
}


const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    // Add other relevant info like req.body if needed, but be careful with sensitive data
  });

  let statusCode = 500;
  let message = 'Internal Server Error';
  let additionalErrors: any = undefined;

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
    if (err instanceof ValidationError && err.errors) {
      additionalErrors = err.errors;
    }
  } else if (err.name === 'ValidationError' && (err as any).errors) {
    // Handle Mongoose validation errors specifically
    statusCode = 422; // Unprocessable Entity
    message = 'Validation failed. Please check your input.';
    additionalErrors = Object.keys((err as any).errors).reduce((acc, key) => {
      acc[key] = (err as any).errors[key].message;
      return acc;
    }, {} as Record<string, string>);
  } else if (err.name === 'CastError' && (err as any).path && (err as any).value) {
    // Handle Mongoose CastError (e.g., invalid ObjectId)
    statusCode = 400;
    message = `Invalid format for field ${(err as any).path}: ${(err as any).value}`;
  }
  // Add more specific error type checks here as needed (e.g., for JWT errors, etc.)


  // Ensure headers haven't already been sent
  if (res.headersSent) {
    return next(err);
  }

  const errorResponse: { status: string; message: string; statusCode: number; errors?: any } = {
    status: 'error',
    message,
    statusCode,
  };

  if (additionalErrors) {
    errorResponse.errors = additionalErrors;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
