/**
 * Middleware de logging de requisições
 */
const requestLogger = (req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

module.exports = requestLogger;
