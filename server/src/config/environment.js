const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

const config = {
	// Configurações do servidor
	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',

	// Configurações da API
	geminiApiKey: process.env.GEMINI_API_KEY,

	// Configurações JWT
	jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

	// Configurações de análise
	maxTextLength: parseInt(process.env.MAX_TEXT_LENGTH) || 8000,
	requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
	maxRedirects: parseInt(process.env.MAX_REDIRECTS) || 5,
	rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY) || 2000,
};

// Validação de configurações obrigatórias
const validateConfig = () => {
	const required = ['geminiApiKey'];
	const missing = required.filter(key => !config[key] || config[key] === 'sua_chave_aqui');

	if (missing.length > 0) {
		throw new Error(`Configurações obrigatórias não encontradas: ${missing.join(', ')}`);
	}
};

module.exports = {
	config,
	validateConfig
};
