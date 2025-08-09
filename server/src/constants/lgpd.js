const LGPD_CONTEXT = `
A Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018, é a legislação brasileira que dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural. Ela se aplica a qualquer operação de tratamento realizada no território nacional, ou que tenha como objetivo a oferta de bens/serviços a indivíduos localizados no Brasil, ou que colete dados de indivíduos no Brasil. A LGPD estabelece 10 princípios fundamentais para o tratamento de dados: Finalidade, Adequação, Necessidade, Livre Acesso, Qualidade dos Dados, Transparência, Segurança, Prevenção, Não Discriminação, e Responsabilização e Prestação de Contas. Além disso, define bases legais para o tratamento de dados (como consentimento, cumprimento de obrigação legal, execução de contrato, legítimo interesse, etc.) e garante uma série de direitos aos titulares dos dados (acesso, retificação, eliminação, portabilidade, etc.). O não cumprimento da LGPD pode acarretar em sanções administrativas, incluindo multas de até 2% do faturamento da empresa no Brasil, limitadas a R$ 50.000.000,00 por infração.
`;

const GDPR_CONTEXT = `
O General Data Protection Regulation (GDPR), Regulamento (UE) 2016/679, é a legislação da União Europeia que visa proteger os dados pessoais e a privacidade de todos os indivíduos dentro da União Europeia (UE) e do Espaço Econômico Europeu (EEE). Ele também aborda a exportação de dados pessoais para fora dessas áreas. A GDPR estabelece 7 princípios fundamentais para o tratamento de dados: Licitude, Lealdade e Transparência; Limitação da Finalidade; Minimização dos Dados; Exatidão; Limitação da Conservação; Integridade e Confidencialidade; e Responsabilidade (Accountability). Assim como a LGPD, a GDPR define bases legais para o tratamento de dados (consentimento, execução de contrato, obrigação legal, interesses legítimos, etc.) e confere direitos robustos aos titulares dos dados (direito à informação, acesso, retificação, apagamento, portabilidade, oposição, etc.). As sanções por não conformidade com a GDPR são severas, podendo chegar a multas de até 20 milhões de euros ou 4% do volume de negócios anual global total do exercício financeiro anterior, o que for mais elevado.
`;

const PRINCIPLES = {
	LGPD: {
		FINALIDADE: "Finalidade",
		ADEQUACAO: "Adequação",
		NECESSIDADE: "Necessidade",
		LIVRE_ACESSO: "Livre Acesso",
		QUALIDADE_DADOS: "Qualidade dos Dados",
		TRANSPARENCIA: "Transparência",
		SEGURANCA: "Segurança",
		PREVENCAO: "Prevenção",
		NAO_DISCRIMINACAO: "Não Discriminação",
		RESPONSABILIZACAO: "Responsabilização e Prestação de Contas"
	},
	GDPR: {
		LICITUDE_LEALDADE_TRANSPARENCIA: "Licitude, Lealdade e Transparência",
		LIMITACAO_FINALIDADE: "Limitação da Finalidade",
		MINIMIZACAO_DADOS: "Minimização dos Dados",
		EXATIDAO: "Exatidão",
		LIMITACAO_CONSERVACAO: "Limitação da Conservação",
		INTEGRIDADE_CONFIDENCIALIDADE: "Integridade e Confidencialidade",
		RESPONSABILIDADE: "Responsabilidade (Accountability)"
	}
};

module.exports = {
	LGPD_CONTEXT,
	GDPR_CONTEXT,
	PRINCIPLES
};
