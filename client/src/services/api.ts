const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface SummaryPoint {
  descricao?: string;
  nivel?: string;
}

export interface ResumoExecutivo {
  principais_problemas_identificados?: SummaryPoint[];
  pontos_positivos?: SummaryPoint[];
  [key: string]: unknown;
}

export interface Principle {
  pontuacao?: number;
  status?: string;
  observacoes?: string;
  brechas_identificadas?: string[];
  [key: string]: unknown;
}

export interface AnalysisResponse {
  pontuacao_geral?: number;
  resumo_executivo?: ResumoExecutivo;
  principios?: Record<string, Principle>;
  confidence?: number;
  recomendacoes?: string[];
  [key: string]: unknown;
}

export async function analyzeText(text: string, company_name?: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_URL}/api/analyze/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, company_name })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze text');
  }

  return await response.json();
}

export async function analyzeUrl(url: string, company_name?: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_URL}/api/analyze/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, company_name })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze url');
  }

  return await response.json();
}

export async function analyzePdf(file: File, company_name?: string): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('pdf', file);
  if (company_name) formData.append('company_name', company_name);

  const response = await fetch(`${API_URL}/api/analyze/pdf`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to analyze pdf');
  }

  return await response.json();
}

export interface AnalysisFile {
  filename: string;
}

export async function listAnalyses(): Promise<AnalysisFile[]> {
  const response = await fetch(`${API_URL}/api/analyze/results`);
  if (!response.ok) {
    throw new Error('Failed to load analyses');
  }
  return await response.json();
}

export async function getAnalysis(filename: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_URL}/api/analyze/results/${filename}`);
  if (!response.ok) {
    throw new Error('Failed to load analysis');
  }
  return await response.json();
}
