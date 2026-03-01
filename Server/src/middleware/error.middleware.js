import logger from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' && status === 500 ? 'Something went wrong!' : message,
    error_code: errorCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}
