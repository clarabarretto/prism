const express = require('express');
const AnalysisController = require('../controllers/analysisController');
const { upload, ensureUploadsDirectory } = require('../middleware/upload');

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
 * @route POST /api/analyze/pdf
 * @description Analisa uma política de privacidade a partir de um arquivo PDF
 * @body { company_name?: string }
 * @file { pdf: File } - Arquivo PDF (multipart/form-data)
 */
router.post('/pdf',
	ensureUploadsDirectory,
	upload.single('pdf'),
	bindMethod(analysisController.analyzeFromPdf)
);

/**
 * @route POST /api/analyze/url-context
 * @description Analisa uma política de privacidade usando contexto de URL do Gemini
 * @body { url: string, company_name?: string }
 */
router.post('/url-context', bindMethod(analysisController.analyzeWithUrlContext));

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

/**
 * @route GET /api/analyze/results/:filename/pdf
 * @description Baixa o resultado de uma análise em PDF
 * @param { filename: string }
 */
router.get('/results/:filename/pdf', bindMethod(analysisController.downloadPdf));

module.exports = router;
