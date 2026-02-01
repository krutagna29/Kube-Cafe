/**
 * Standardized API Response Utility
 * All API responses follow this format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: any (optional)
 * }
 */

exports.success = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

exports.error = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

exports.serverError = (res, message = 'Server error', error = null) => {
  const response = {
    success: false,
    message
  };
  // Only include error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
  }
  return res.status(500).json(response);
};

