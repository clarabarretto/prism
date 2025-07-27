import PrivacyPolicyAnalyzer from './privacy-policy-analyzer';

/**
 * Script de teste para demonstrar o uso do PrivacyPolicyAnalyzer
 */
async function testAnalyzer() {
	// Configuração da API
	const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

	if (!GEMINI_API_KEY) {
		console.log('❌ Please configure the GEMINI_API_KEY environment variable');
		process.exit(1);
	}

	console.log('🚀 Starting DataGuardAI test...\n');

	// Inicializa o analisador
	const analyzer = new PrivacyPolicyAnalyzer(GEMINI_API_KEY);

	// Aguarda o carregamento do contexto LGPD
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Teste com uma URL específica
	const testUrl = 'https://policies.google.com/privacy?hl=pt-BR';
	const companyName = 'Google';

	console.log(`📋 Testing privacy policy analysis of ${companyName}`);
	console.log(`🔗 URL: ${testUrl}\n`);

	try {
		// Executa a análise
		const result = await analyzer.analyzeUrl(testUrl, companyName);

		if (result.error) {
			console.log('❌ Error in analysis:', result.error);
			return;
		}

		// Exibe os resultados
		console.log('✅ Analysis completed successfully!\n');
		console.log('📊 RESULTS:');
		console.log(`   Company: ${result.company}`);
		console.log(`   General Score: ${result.general_score}/10`);
		console.log(`   Leakage Risk: ${result.leakage_risk}\n`);

		// Exibe pontuações por princípio
		console.log('📋 PRINCIPLE SCORES:');
		Object.entries(result.principios).forEach(([principio, dados]) => {
			const emoji = dados.status === 'Conforme' ? '✅' :
				dados.status === 'Parcialmente Conforme' ? '⚠️' : '❌';
			console.log(`   ${emoji} ${principio.toUpperCase()}: ${dados.pontuacao}/10 (${dados.status})`);
		});

		console.log('\n📝 RESUMO EXECUTIVO:');
		console.log(`   ${result.resumo_executivo}\n`);

		console.log('💡 PRINCIPAL RECOMMENDATIONS:');
		result.recomendacoes.forEach((rec, index) => {
			console.log(`   ${index + 1}. ${rec}`);
		});

		// Salva o resultado
		const filename = `teste_analise_${companyName.toLowerCase()}.json`;
		await analyzer.saveAnalysisResult(result, filename);
		console.log(`\n💾 Full result saved in: ${filename}`);

	} catch (error) {
		console.error('❌ Error during test:', error.message);
	}
}

// Função para testar apenas a extração de texto (sem usar a API do Gemini)
async function testTextExtraction() {
	console.log('🧪 Testing text extraction...\n');

	// Cria uma instância sem chave da API (apenas para teste de extração)
	const analyzer = new PrivacyPolicyAnalyzer('fake_key');

	const testUrls = [
		'https://policies.google.com/privacy?hl=pt-BR',
		'https://www.apple.com/legal/privacy/en-ww/',
		'https://www.microsoft.com/pt-br/privacy/privacystatement'
	];

	for (const url of testUrls) {
		console.log(`📄 Extraindo texto de: ${url}`);

		try {
			const text = await analyzer.extractPrivacyPolicyText(url);

			if (text) {
				console.log(`✅ Success! Text extracted (${text.length} characters)`);
				console.log(`   Preview: "${text.substring(0, 100)}..."\n`);
			} else {
				console.log('❌ Text extraction failed\n');
			}
		} catch (error) {
			console.error(`❌ Error: ${error.message}\n`);
		}

		// Pausa entre requisições
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

// Função principal
async function main() {
	const args = process.argv.slice(2);

	if (args.includes('--text-only')) {
		await testTextExtraction();
	} else {
		await testAnalyzer();
	}
}

// Executa se for chamado diretamente
if (require.main === module) {
	main().catch(console.error);
}
