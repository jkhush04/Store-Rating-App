function errorHandler(err, req, res, next) {
  console.error(err);
 
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
 
  res.status(status).json({
    success: false,
    message
  });
}
 
// Custom error class so controllers can throw with a specific status code:
// throw new ApiError(404, 'Store not found');
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
 
module.exports = { errorHandler, ApiError };
 