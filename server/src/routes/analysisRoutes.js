const express = require('express');
const AnalysisController = require('../controllers/analysisController');

const router = express.Router();
const analysisController = new AnalysisController();

// Bind dos métodos ao contexto correto
const bindMethod = (method) => method.bind(analysisController);

/**
 * @route POST /api/analyze/url
 * @description Analisa uma política de privacidade a partir de uma URL
 * @body { url: string, company_name?: string }
 */
router.post('/url', bindMethod(analysisController.analyzeFromUrl));

/**
 * @route POST /api/analyze/text
 * @description Analisa uma política de privacidade a partir de texto direto
 * @body { text: string, company_name?: string }
 */
router.post('/text', bindMethod(analysisController.analyzeFromText));

/**
 * @route POST /api/analyze/extract-text
 * @description Extrai apenas o texto de uma URL (sem análise)
 * @body { url: string }
 */
router.post('/extract-text', bindMethod(analysisController.extractText));

/**
 * @route GET /api/analyze/results
 * @description Lista todas as análises salvas
 * @query { include_details?: boolean }
 */
router.get('/results', bindMethod(analysisController.listAnalyses));

/**
 * @route GET /api/analyze/results/:filename
 * @description Carrega uma análise específica
 * @param { filename: string }
 */
router.get('/results/:filename', bindMethod(analysisController.getAnalysis));

/**
 * @route GET /api/analyze/health
 * @description Health check específico para o serviço de análise
 */
router.get('/health', bindMethod(analysisController.healthCheck));

module.exports = router;
