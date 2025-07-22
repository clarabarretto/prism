import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Shield, Eye, Clock, Users, Building, MapPin } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DetailedAnalysisProps {
  profileType: "user" | "company";
  score: number;
}

// Mock data mais completo para análise detalhada
const getDetailedResults = (profileType: "user" | "company", score: number) => {
  return {
    categories: [
      {
        id: "data-collection",
        title: "Coleta de Dados",
        score: score > 70 ? 85 : score > 40 ? 60 : 25,
        issues: [
          {
            level: "high" as const,
            title: "Coleta excessiva de dados pessoais",
            description: "A política autoriza coleta de informações além do necessário para o serviço.",
            excerpt: "Coletamos informações sobre você, seu dispositivo, localização, contatos...",
            lawReference: "Art. 6º, I da LGPD - Princípio da Adequação"
          },
          {
            level: "medium" as const,
            title: "Falta de especificação das finalidades",
            description: "Não detalha exatamente para que os dados serão utilizados.",
            excerpt: "Utilizamos seus dados para melhorar nossos serviços e experiência.",
            lawReference: "Art. 6º, II da LGPD - Princípio da Finalidade"
          }
        ]
      },
      {
        id: "sharing",
        title: "Compartilhamento",
        score: score > 70 ? 90 : score > 40 ? 45 : 20,
        issues: [
          {
            level: "high" as const,
            title: "Compartilhamento com terceiros indefinidos",
            description: "Permite compartilhar dados sem especificar quem são os parceiros.",
            excerpt: "Podemos compartilhar informações com nossos parceiros comerciais...",
            lawReference: "Art. 7º da LGPD - Consentimento específico"
          }
        ]
      },
      {
        id: "retention",
        title: "Retenção de Dados",
        score: score > 70 ? 75 : score > 40 ? 50 : 30,
        issues: [
          {
            level: "medium" as const,
            title: "Período de retenção indefinido",
            description: "Não especifica por quanto tempo os dados serão mantidos.",
            excerpt: "Manteremos suas informações pelo tempo necessário...",
            lawReference: "Art. 15 da LGPD - Término do tratamento"
          }
        ]
      },
      {
        id: "rights",
        title: "Direitos do Titular",
        score: score > 70 ? 40 : score > 40 ? 70 : 85,
        issues: [
          {
            level: "low" as const,
            title: "Direitos claramente especificados",
            description: "A política lista adequadamente os direitos do usuário.",
            excerpt: "Você tem direito a acessar, corrigir, excluir seus dados...",
            lawReference: "Art. 18 da LGPD - Direitos do titular"
          }
        ]
      }
    ],
    riskFactors: [
      {
        icon: Users,
        title: "Dados sensíveis coletados",
        description: "Coleta informações sobre saúde, orientação política ou religiosa",
        severity: "high" as const
      },
      {
        icon: Building,
        title: "Transferência internacional",
        description: "Dados podem ser enviados para países sem proteção adequada",
        severity: "high" as const
      },
      {
        icon: MapPin,
        title: "Localização precisa",
        description: "Rastreamento contínuo de localização mesmo quando app fechado",
        severity: "medium" as const
      },
      {
        icon: Clock,
        title: "Retenção excessiva",
        description: "Dados mantidos por período superior ao necessário",
        severity: "medium" as const
      }
    ]
  };
};

export function DetailedAnalysis({ profileType, score }: DetailedAnalysisProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["data-collection"]);
  const results = getDetailedResults(profileType, score);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getLevelColor = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high": return "text-red bg-red/10 border-red/20";
      case "medium": return "text-orange bg-orange/10 border-orange/20";
      case "low": return "text-green bg-green/10 border-green/20";
    }
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high": return "text-red";
      case "medium": return "text-orange";
      case "low": return "text-green";
    }
  };

  const getCategoryScoreColor = (score: number) => {
    if (score >= 70) return "text-red";
    if (score >= 40) return "text-orange";
    return "text-green";
  };

  return (
    <div className="space-y-8">
      {/* Risk Factors Overview */}
      <GlassCard variant="strong" className="p-6">
        <h3 className="text-xl font-semibold mb-6">Principais Fatores de Risco</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {results.riskFactors.map((factor, index) => {
            const Icon = factor.icon;
            return (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className={`p-2 rounded-lg ${getSeverityColor(factor.severity)} bg-current/10`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{factor.title}</h4>
                  <p className="text-gray-2 text-xs mt-1">{factor.description}</p>
                </div>
                <Badge className={`${getSeverityColor(factor.severity)} bg-current/10 border-current/20 text-xs`}>
                  {factor.severity === "high" ? "Alto" : factor.severity === "medium" ? "Médio" : "Baixo"}
                </Badge>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Detailed Category Analysis */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Análise por Categoria</h3>
        
        {results.categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <GlassCard key={category.id} variant="default" className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-2" />
                    )}
                    <h4 className="text-lg font-medium">{category.title}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={cn("text-sm font-medium", getCategoryScoreColor(category.score))}>
                      Score: {category.score}%
                    </span>
                    {category.issues.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {category.issues.length} issue{category.issues.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-white/10">
                  {category.issues.map((issue, index) => (
                    <div key={index} className="space-y-3 pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={cn("p-1.5 rounded border", getLevelColor(issue.level))}>
                            {issue.level === "high" ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : issue.level === "medium" ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{issue.title}</h5>
                            <p className="text-gray-2 text-sm mt-1">{issue.description}</p>
                          </div>
                        </div>
                        
                        <Badge className={cn("text-xs", getLevelColor(issue.level))}>
                          {issue.level === "high" ? "Alto" : issue.level === "medium" ? "Médio" : "Baixo"}
                        </Badge>
                      </div>
                      
                      {/* Excerpt */}
                      <div className="ml-9 space-y-2">
                        <div className="bg-gray-1/5 p-3 rounded border border-gray-1/10">
                          <p className="text-xs italic text-gray-2">"{issue.excerpt}"</p>
                        </div>
                        
                        {profileType === "company" && (
                          <div className="bg-blue/5 p-3 rounded border border-blue/10">
                            <p className="text-xs text-blue">
                              <strong>Base legal:</strong> {issue.lawReference}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}