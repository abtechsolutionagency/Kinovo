export class AppError extends Error {
  constructor(message, statusCode = 500, error = 'Server error') {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.isOperational = true;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.error,
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: 'Resource already exists',
    });
  }

  if (err.name === 'MulterError' || err.message?.includes('image')) {
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message,
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
}
