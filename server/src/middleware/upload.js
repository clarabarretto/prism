const multer = require('multer');
const path = require('path');

// Configuração do storage para upload de arquivos
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Diretório temporário para uploads
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		// Gera nome único para o arquivo
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});

// Filtro para aceitar apenas PDFs
const fileFilter = (req, file, cb) => {
	// Verifica se é um PDF
	if (file.mimetype === 'application/pdf') {
		cb(null, true);
	} else {
		cb(new Error('Apenas arquivos PDF são permitidos'), false);
	}
};

// Configuração do multer
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB máximo
		files: 1 // Apenas 1 arquivo por vez
	}
});

// Middleware para criar diretório de uploads se não existir
const ensureUploadsDirectory = (req, res, next) => {
	const fs = require('fs');
	const uploadsDir = 'uploads';

	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	next();
};

module.exports = {
	upload,
	ensureUploadsDirectory
};
