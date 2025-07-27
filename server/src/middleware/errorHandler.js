const { HTTP_STATUS } = require('../constants/api');
const { config } = require('../config/environment');

/**
 * Middleware de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Unhandled error:', err);

  // Erro de JSON inválido
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid JSON in request body',
      details: err.message
    });
  }

  // Erro genérico
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware para rotas não encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Endpoint not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    available_endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/docs',
      'POST /api/analyze/url',
      'POST /api/analyze/text',
      'POST /api/analyze/extract-text',
      'GET /api/analyze/results',
      'GET /api/analyze/results/:filename',
      'GET /api/analyze/health'
    ],
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
