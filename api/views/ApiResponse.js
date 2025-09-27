class ApiResponse {
  static success(res, data, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message, statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }

    return res.status(statusCode).json(response);
  }

  static validationError(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  static healthCheck(res, data = {}) {
    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  static healthCheckWarning(res, message, data = {}) {
    return res.status(200).json({
      status: 'WARNING',
      message,
      timestamp: new Date().toISOString(),
      ...data
    });
  }
}

module.exports = ApiResponse;
