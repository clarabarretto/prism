const express = require('express');
const cors = require('cors');
const { config, validateConfig } = require('./config/environment');
const analysisRoutes = require('./routes/analysisRoutes');
const { HTTP_STATUS } = require('./constants/api');

class App {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configura os middlewares da aplicação
   */
  setupMiddlewares() {
    // CORS
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    if (config.nodeEnv === 'development') {
      this.app.use((req, res, next) => {
        console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
      });
    }

    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  /**
   * Configura as rotas da aplicação
   */
  setupRoutes() {
    // Rota principal
    this.app.get('/', (req, res) => {
      res.json({
        message: '🔍 DataGuard AI - Analisador de Políticas de Privacidade LGPD',
        status: 'Servidor rodando com sucesso',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          analyze_url: 'POST /api/analyze/url',
          analyze_text: 'POST /api/analyze/text',
          extract_text: 'POST /api/analyze/extract-text',
          list_results: 'GET /api/analyze/results',
          get_result: 'GET /api/analyze/results/:filename',
          analysis_health: 'GET /api/analyze/health'
        },
        timestamp: new Date().toISOString()
      });
    });

    // Health check geral
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'OK',
        message: 'API DataGuard AI funcionando perfeitamente',
        uptime: process.uptime(),
        environment: config.nodeEnv,
        memory_usage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      });
    });

    // Rotas de análise
    this.app.use('/api/analyze', analysisRoutes);

    // Rota para documentação da API
    this.app.get('/api/docs', (req, res) => {
      res.json({
        title: 'DataGuard AI - API Documentation',
        description: 'API para análise de políticas de privacidade conforme LGPD',
        version: '1.0.0',
        endpoints: [
          {
            method: 'POST',
            path: '/api/analyze/url',
            description: 'Analisa política de privacidade a partir de URL',
            body: {
              url: 'string (obrigatório)',
              company_name: 'string (opcional)'
            },
            example: {
              url: 'https://policies.google.com/privacy?hl=pt-BR',
              company_name: 'Google'
            }
          },
          {
            method: 'POST',
            path: '/api/analyze/text',
            description: 'Analisa política de privacidade a partir de texto',
            body: {
              text: 'string (obrigatório, min 100 chars)',
              company_name: 'string (opcional)'
            }
          },
          {
            method: 'POST',
            path: '/api/analyze/extract-text',
            description: 'Extrai apenas texto de uma URL',
            body: {
              url: 'string (obrigatório)'
            }
          },
          {
            method: 'GET',
            path: '/api/analyze/results',
            description: 'Lista todas as análises salvas',
            query: {
              include_details: 'boolean (opcional)'
            }
          },
          {
            method: 'GET',
            path: '/api/analyze/results/:filename',
            description: 'Carrega análise específica'
          }
        ]
      });
    });
  }

  /**
   * Configura o tratamento de erros
   */
  setupErrorHandling() {
    // Middleware de tratamento de erros
    this.app.use((err, req, res, next) => {
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
    });

    // Middleware para rotas não encontradas
    this.app.use('*', (req, res) => {
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
    });
  }

  /**
   * Inicia o servidor
   */
  async start() {
    try {
      // Valida configurações
      validateConfig();

      // Inicia o servidor
      this.server = this.app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        console.log(`Environment: ${config.nodeEnv}`);
      });

      // Tratamento de sinais para graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      console.error('❌ Error starting server:', error.message);
      process.exit(1);
    }
  }

  /**
   * Executa um shutdown graceful do servidor
   */
  gracefulShutdown(signal) {
    console.log(`\n📟 Received signal ${signal}. Starting graceful shutdown...`);

    if (this.server) {
      this.server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.log('Forcing shutdown');
        process.exit(1);
      }, 30000);
    } else {
      process.exit(0);
    }
  }

  /**
   * Retorna a instância do Express
   */
  getApp() {
    return this.app;
  }
}

module.exports = App;
