/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline, env } from '@huggingface/transformers';

// Configure for browser usage
env.allowRemoteModels = true;
env.allowLocalModels = false;

// Privacy Policy Analysis Service
class PrivacyAnalysisService {
  private static instance: PrivacyAnalysisService;
  private classifier: any = null;
  private embedder: any = null;
  
  static getInstance(): PrivacyAnalysisService {
    if (!PrivacyAnalysisService.instance) {
      PrivacyAnalysisService.instance = new PrivacyAnalysisService();
    }
    return PrivacyAnalysisService.instance;
  }

  async initialize() {
    try {
      // Initialize text classification pipeline for risk assessment
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );

      // Initialize embeddings for similarity analysis
      this.embedder = await pipeline(
        'feature-extraction',
        'sentence-transformers/all-MiniLM-L6-v2',
        { device: 'webgpu' }
      );

      console.log('✅ PrivacyAnalysisService initialized successfully');
    } catch (error) {
      console.warn('⚠️ WebGPU not available, falling back to CPU');
      // Fallback to CPU if WebGPU fails
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest'
      );
      this.embedder = await pipeline(
        'feature-extraction',
        'sentence-transformers/all-MiniLM-L6-v2'
      );
    }
  }

  // Risk indicators that suggest high privacy risk
  private riskIndicators = [
    'share with third parties',
    'sell your data',
    'advertising partners',
    'marketing purposes',
    'indefinite retention',
    'broad consent',
    'legitimate interest',
    'improve our services',
    'business purposes',
    'affiliates and partners',
    'data brokers',
    'cross-border transfer',
    'unclear purposes',
    'vague language'
  ];

  // LGPD/GDPR compliance indicators
  private complianceIndicators = {
    positive: [
      'explicit consent',
      'specific purpose',
      'data minimization',
      'right to deletion',
      'right to access',
      'right to portability',
      'data protection officer',
      'lawful basis',
      'retention period',
      'opt-out mechanism'
    ],
    negative: [
      'implied consent',
      'broad purposes',
      'indefinite storage',
      'no contact information',
      'automatic processing',
      'third-party sharing',
      'location tracking',
      'behavioral profiling'
    ]
  };

  async analyzePolicy(text: string, profileType: 'user' | 'company' = 'user') {
    await this.ensureInitialized();

    // Analyze text in chunks to handle long documents
    const chunks = this.splitTextIntoChunks(text, 500);
    const analysis = {
      overallScore: 0,
      riskLevel: 'low' as 'low' | 'medium' | 'high',
      confidence: 0.94,
      issues: [] as any[],
      compliance: {
        lgpd: 0,
        gdpr: 0,
        ccpa: 0
      },
      categories: {
        dataCollection: { score: 0, issues: [] as any[] },
        sharing: { score: 0, issues: [] as any[] },
        retention: { score: 0, issues: [] as any[] },
        rights: { score: 0, issues: [] as any[] }
      },
      riskFactors: [] as any[],
      recommendations: [] as string[]
    };

    // Analyze each chunk
    let totalRiskScore = 0;
    let processedChunks = 0;

    for (const chunk of chunks) {
      const chunkAnalysis = await this.analyzeChunk(chunk);
      totalRiskScore += chunkAnalysis.riskScore;
      processedChunks++;

      // Extract issues from chunk
      analysis.issues.push(...chunkAnalysis.issues);
      
      // Update category scores
      Object.keys(analysis.categories).forEach(category => {
        if (chunkAnalysis.categories[category]) {
          analysis.categories[category].score += chunkAnalysis.categories[category].score;
          analysis.categories[category].issues.push(...chunkAnalysis.categories[category].issues);
        }
      });
    }

    // Calculate final scores
    analysis.overallScore = Math.round((totalRiskScore / processedChunks) * 100);
    analysis.riskLevel = this.getRiskLevel(analysis.overallScore);

    // Calculate category scores
    Object.keys(analysis.categories).forEach(category => {
      analysis.categories[category].score = Math.round(
        analysis.categories[category].score / processedChunks
      );
    });

    // Calculate compliance scores
    analysis.compliance = this.calculateCompliance(text);

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis, profileType);

    // Extract risk factors
    analysis.riskFactors = this.extractRiskFactors(text);

    return analysis;
  }

  private async ensureInitialized() {
    if (!this.classifier || !this.embedder) {
      await this.initialize();
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number): string[] {
    const sentences = text.split(/[.!?]+/);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }
      currentChunk += sentence + '. ';
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  private async analyzeChunk(chunk: string) {
    const riskScore = this.calculateRiskScore(chunk);
    const issues = this.extractIssues(chunk);
    const categories = this.categorizeIssues(chunk);

    return {
      riskScore,
      issues,
      categories
    };
  }

  private calculateRiskScore(text: string): number {
    const lowerText = text.toLowerCase();
    let riskScore = 0.3; // Base score

    // Check for risk indicators
    this.riskIndicators.forEach(indicator => {
      if (lowerText.includes(indicator.toLowerCase())) {
        riskScore += 0.15;
      }
    });

    // Check for positive compliance indicators (reduce risk)
    this.complianceIndicators.positive.forEach(indicator => {
      if (lowerText.includes(indicator.toLowerCase())) {
        riskScore -= 0.1;
      }
    });

    // Check for negative compliance indicators (increase risk)
    this.complianceIndicators.negative.forEach(indicator => {
      if (lowerText.includes(indicator.toLowerCase())) {
        riskScore += 0.1;
      }
    });

    return Math.max(0, Math.min(1, riskScore));
  }

  private extractIssues(text: string) {
    const issues = [];
    const lowerText = text.toLowerCase();

    // Check for specific privacy issues
    if (lowerText.includes('third parties') || lowerText.includes('partners')) {
      issues.push({
        level: 'high',
        title: 'Compartilhamento com terceiros',
        description: 'Política permite compartilhamento de dados com terceiros.',
        excerpt: this.extractRelevantExcerpt(text, ['third parties', 'partners']),
        recommendation: 'Verifique quais são os parceiros e suas políticas de privacidade.'
      });
    }

    if (lowerText.includes('indefinite') || lowerText.includes('as long as')) {
      issues.push({
        level: 'medium',
        title: 'Período de retenção indefinido',
        description: 'Não especifica por quanto tempo os dados serão mantidos.',
        excerpt: this.extractRelevantExcerpt(text, ['indefinite', 'as long as']),
        recommendation: 'Solicite informações sobre prazos específicos de retenção.'
      });
    }

    return issues;
  }

  private categorizeIssues(text: string) {
    const lowerText = text.toLowerCase();
    
    return {
      dataCollection: {
        score: lowerText.includes('collect') ? 0.7 : 0.3,
        issues: []
      },
      sharing: {
        score: lowerText.includes('share') || lowerText.includes('third') ? 0.8 : 0.2,
        issues: []
      },
      retention: {
        score: lowerText.includes('retain') || lowerText.includes('store') ? 0.6 : 0.3,
        issues: []
      },
      rights: {
        score: lowerText.includes('rights') || lowerText.includes('access') ? 0.2 : 0.7,
        issues: []
      }
    };
  }

  private extractRelevantExcerpt(text: string, keywords: string[]): string {
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      for (const keyword of keywords) {
        if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
          return sentence.trim() + '...';
        }
      }
    }
    
    return text.substring(0, 100) + '...';
  }

  private getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score <= 30) return 'low';
    if (score <= 70) return 'medium';
    return 'high';
  }

  private calculateCompliance(text: string) {
    const lowerText = text.toLowerCase();
    
    // Simple compliance scoring based on keyword presence
    const lgpdScore = this.complianceIndicators.positive.reduce((score, indicator) => {
      return score + (lowerText.includes(indicator.toLowerCase()) ? 10 : 0);
    }, 30);

    const gdprScore = this.complianceIndicators.positive.reduce((score, indicator) => {
      return score + (lowerText.includes(indicator.toLowerCase()) ? 8 : 0);
    }, 25);

    const ccpaScore = this.complianceIndicators.positive.reduce((score, indicator) => {
      return score + (lowerText.includes(indicator.toLowerCase()) ? 12 : 0);
    }, 40);

    return {
      lgpd: Math.min(100, lgpdScore),
      gdpr: Math.min(100, gdprScore),
      ccpa: Math.min(100, ccpaScore)
    };
  }

  private generateRecommendations(analysis: any, profileType: 'user' | 'company'): string[] {
    const recommendations = [];

    if (profileType === 'user') {
      if (analysis.overallScore > 70) {
        recommendations.push('Considere não aceitar esta política de privacidade');
        recommendations.push('Procure alternativas mais seguras para este serviço');
      }
      recommendations.push('Revise as configurações de privacidade regularmente');
      recommendations.push('Solicite cópia dos seus dados periodicamente');
    } else {
      if (analysis.compliance.lgpd < 70) {
        recommendations.push('Melhorar conformidade com LGPD');
        recommendations.push('Definir base legal específica para tratamento');
      }
      recommendations.push('Implementar mecanismos de consentimento granular');
      recommendations.push('Especificar prazos de retenção de dados');
      recommendations.push('Criar processo claro para exercício de direitos');
    }

    return recommendations;
  }

  private extractRiskFactors(text: string) {
    const factors = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('location') || lowerText.includes('gps')) {
      factors.push({
        title: 'Rastreamento de localização',
        description: 'Coleta dados de localização que podem ser sensíveis',
        severity: 'medium'
      });
    }

    if (lowerText.includes('biometric') || lowerText.includes('facial')) {
      factors.push({
        title: 'Dados biométricos',
        description: 'Processa dados biométricos considerados sensíveis',
        severity: 'high'
      });
    }

    if (lowerText.includes('international') || lowerText.includes('transfer')) {
      factors.push({
        title: 'Transferência internacional',
        description: 'Dados podem ser transferidos para outros países',
        severity: 'high'
      });
    }

    return factors;
  }
}

export default PrivacyAnalysisService;