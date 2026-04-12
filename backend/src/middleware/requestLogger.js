// ============================================================
//  src/middleware/requestLogger.js
//  Logs every incoming request to the console.
// ============================================================

function requestLogger(req, _res, next) {
  const ts   = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}]  ${req.method.padEnd(6)} ${req.path}`;
  if (process.env.NODE_ENV !== 'test') console.log(line);
  next();
}

module.exports = { requestLogger };
