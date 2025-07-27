const express = require('express');
const { config, validateConfig } = require('./config/environment');
const analysisRoutes = require('./routes/analysisRoutes');

// Middlewares
const corsMiddleware = require('./middleware/cors');
const requestLogger = require('./middleware/logging');
const securityHeaders = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

class App {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    // CORS
    this.app.use(corsMiddleware);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging (apenas em desenvolvimento)
    if (config.nodeEnv === 'development') {
      this.app.use(requestLogger);
    }

    // Security headers
    this.app.use(securityHeaders);
  }

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

  setupErrorHandling() {
    // Middleware de tratamento de erros
    this.app.use(errorHandler);

    // Middleware para rotas não encontradas
    this.app.use('*', notFoundHandler);
  }

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

  gracefulShutdown(signal) {
    console.log(`\n Received signal ${signal}. Starting graceful shutdown...`);

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

  getApp() {
    return this.app;
  }
}

module.exports = App;
