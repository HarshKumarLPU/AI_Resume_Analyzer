const { sendError } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = [];

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = 'Validation Error';
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => val.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
