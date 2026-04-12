// ============================================================
//  src/middleware/errorHandler.js
//  Global Express error handler — keeps error responses consistent.
// ============================================================

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  console.error('🔴  Unhandled error:', err.message);
  if (process.env.NODE_ENV === 'development') console.error(err.stack);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error:   err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
