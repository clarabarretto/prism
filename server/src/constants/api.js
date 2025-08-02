// Headers padrão para requisições HTTP
const DEFAULT_HEADERS = {
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
	'Accept-Encoding': 'gzip, deflate, br',
	'Connection': 'keep-alive',
	'Upgrade-Insecure-Requests': '1'
};

// Códigos de status HTTP
const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503
};

// Mensagens de erro padrão
const ERROR_MESSAGES = {
	INVALID_URL: 'URL inválida fornecida',
	EXTRACTION_FAILED: 'Falha na extração do texto da política de privacidade',
	ANALYSIS_FAILED: 'Falha na análise da política de privacidade',
	INVALID_GEMINI_KEY: 'Chave da API Gemini inválida ou não fornecida',
	NETWORK_ERROR: 'Erro de rede ao acessar a URL',
	TIMEOUT_ERROR: 'Timeout na requisição',
	PARSING_ERROR: 'Erro ao processar a resposta',
	MISSING_COMPANY_NAME: 'Nome da empresa não fornecido',
	EMPTY_POLICY_TEXT: 'Texto da política de privacidade está vazio',
	INVALID_PDF_FILE: 'Arquivo PDF inválido ou corrompido',
	PDF_EXTRACTION_FAILED: 'Falha na extração do texto do PDF',
	NO_PDF_UPLOADED: 'Nenhum arquivo PDF foi enviado'
};

// Mensagens de sucesso
const SUCCESS_MESSAGES = {
	ANALYSIS_COMPLETED: 'Análise da política de privacidade concluída com sucesso',
	TEXT_EXTRACTED: 'Texto extraído com sucesso',
	RESULT_SAVED: 'Resultado salvo com sucesso',
	PDF_ANALYSIS_COMPLETED: 'Análise do PDF concluída com sucesso',
	PDF_TEXT_EXTRACTED: 'Texto extraído do PDF com sucesso'
};

// Endpoints da API
const API_ENDPOINTS = {
	ANALYZE_URL: '/api/analyze/url',
	ANALYZE_TEXT: '/api/analyze/text',
	ANALYZE_PDF: '/api/analyze/pdf',
	ANALYZE_URL_CONTEXT: '/api/analyze/url-context',
	HEALTH: '/api/health',
	RESULTS: '/api/results'
};

// Limites da API
const API_LIMITS = {
	MAX_URL_LENGTH: 2048,
	MAX_COMPANY_NAME_LENGTH: 100,
	MIN_TEXT_LENGTH: 100,
	MAX_CONCURRENT_REQUESTS: 5
};

// Tipos de resposta
const RESPONSE_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning'
};

module.exports = {
	DEFAULT_HEADERS,
	HTTP_STATUS,
	ERROR_MESSAGES,
	SUCCESS_MESSAGES,
	API_ENDPOINTS,
	API_LIMITS,
	RESPONSE_TYPES
};
