// Princípios da LGPD conforme Art. 6º da Lei 13.709/2018
const LGPD_PRINCIPLES = {
  FINALIDADE: 'finalidade',
  ADEQUACAO: 'adequacao',
  NECESSIDADE: 'necessidade',
  LIVRE_ACESSO: 'livre_acesso',
  QUALIDADE_DADOS: 'qualidade_dados',
  TRANSPARENCIA: 'transparencia',
  SEGURANCA: 'seguranca',
  PREVENCAO: 'prevencao',
  NAO_DISCRIMINACAO: 'nao_discriminacao',
  RESPONSABILIZACAO: 'responsabilizacao'
};

// Status de conformidade
const COMPLIANCE_STATUS = {
  CONFORME: 'Conforme',
  NAO_CONFORME: 'Não Conforme',
  PARCIALMENTE_CONFORME: 'Parcialmente Conforme'
};

// Níveis de risco
const RISK_LEVELS = {
  BAIXO: 'Baixo',
  MEDIO: 'Médio',
  ALTO: 'Alto'
};

// Descrições dos princípios
const PRINCIPLE_DESCRIPTIONS = {
  [LGPD_PRINCIPLES.FINALIDADE]: {
    name: 'Finalidade',
    description: 'Realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular'
  },
  [LGPD_PRINCIPLES.ADEQUACAO]: {
    name: 'Adequação',
    description: 'Compatibilidade do tratamento com as finalidades informadas ao titular'
  },
  [LGPD_PRINCIPLES.NECESSIDADE]: {
    name: 'Necessidade',
    description: 'Limitação do tratamento ao mínimo necessário para a realização de suas finalidades'
  },
  [LGPD_PRINCIPLES.LIVRE_ACESSO]: {
    name: 'Livre Acesso',
    description: 'Garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e a duração do tratamento'
  },
  [LGPD_PRINCIPLES.QUALIDADE_DADOS]: {
    name: 'Qualidade dos Dados',
    description: 'Garantia, aos titulares, de exatidão, clareza, relevância e atualização dos dados'
  },
  [LGPD_PRINCIPLES.TRANSPARENCIA]: {
    name: 'Transparência',
    description: 'Garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre o tratamento'
  },
  [LGPD_PRINCIPLES.SEGURANCA]: {
    name: 'Segurança',
    description: 'Utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais'
  },
  [LGPD_PRINCIPLES.PREVENCAO]: {
    name: 'Prevenção',
    description: 'Adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais'
  },
  [LGPD_PRINCIPLES.NAO_DISCRIMINACAO]: {
    name: 'Não Discriminação',
    description: 'Impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos'
  },
  [LGPD_PRINCIPLES.RESPONSABILIZACAO]: {
    name: 'Responsabilização e Prestação de Contas',
    description: 'Demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas'
  }
};

// Contexto básico da LGPD
const LGPD_CONTEXT = `
A Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018 estabelece princípios, regras e procedimentos para o tratamento de dados pessoais no Brasil.

PRINCÍPIOS FUNDAMENTAIS:

1. FINALIDADE: O tratamento deve ter propósitos legítimos, específicos, explícitos e informados ao titular.

2. ADEQUAÇÃO: O tratamento deve ser compatível com as finalidades informadas ao titular.

3. NECESSIDADE: Limitação do tratamento ao mínimo necessário para realizar suas finalidades.

4. LIVRE ACESSO: Garantia aos titulares de consulta facilitada e gratuita sobre o tratamento.

5. QUALIDADE DOS DADOS: Garantia de exatidão, clareza, relevância e atualização dos dados.

6. TRANSPARÊNCIA: Informações claras, precisas e facilmente acessíveis sobre o tratamento.

7. SEGURANÇA: Medidas técnicas e administrativas para proteger os dados pessoais.

8. PREVENÇÃO: Medidas para prevenir danos decorrentes do tratamento de dados.

9. NÃO DISCRIMINAÇÃO: Impossibilidade de tratamento para fins discriminatórios ilícitos.

10. RESPONSABILIZAÇÃO: Demonstração da adoção de medidas eficazes de cumprimento das normas.
`;

module.exports = {
  LGPD_PRINCIPLES,
  COMPLIANCE_STATUS,
  RISK_LEVELS,
  PRINCIPLE_DESCRIPTIONS,
  LGPD_CONTEXT
};
