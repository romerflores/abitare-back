// middleware/errorHandler.js
import { error as logError } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logError('Error:', err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
}

export default errorHandler;
