import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  FileCheck, 
  Users,
  Calendar,
  Download,
  Plus,
  Eye
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { ScoreGauge } from "./ScoreGauge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyData } from "./CompanyRegistration";

interface CompanyDashboardProps {
  companyData: CompanyData;
  onNewAnalysis: () => void;
  onViewAnalysis: (analysisId: string) => void;
  onManageDocuments: () => void;
  onHome: () => void;
}

// Mock data for dashboard
const mockDashboardData = {
  overview: {
    totalPolicies: 3,
    averageScore: 67,
    activeAlerts: 8,
    lastUpdate: "2024-01-15"
  },
  recentAnalyses: [
    {
      id: "1",
      name: "Política de Privacidade Principal",
      score: 72,
      status: "medium",
      date: "2024-01-15",
      regulations: ["lgpd", "gdpr"]
    },
    {
      id: "2", 
      name: "Termos de Uso App Mobile",
      score: 45,
      status: "high",
      date: "2024-01-12",
      regulations: ["lgpd"]
    },
    {
      id: "3",
      name: "Política de Cookies",
      score: 85,
      status: "low", 
      date: "2024-01-10",
      regulations: ["lgpd", "gdpr"]
    }
  ],
  compliance: {
    lgpd: { score: 75, trend: "up", issues: 3 },
    gdpr: { score: 68, trend: "down", issues: 5 },
    ccpa: { score: 82, trend: "up", issues: 1 }
  },
  priorityActions: [
    {
      priority: "high",
      title: "Revisar base legal para tratamento de dados",
      description: "3 políticas não especificam base legal adequada",
      regulation: "LGPD Art. 7º",
      affectedPolicies: 3
    },
    {
      priority: "medium", 
      title: "Implementar mecanismo de opt-out",
      description: "Facilitar exercício de direitos do titular",
      regulation: "LGPD Art. 18",
      affectedPolicies: 2
    },
    {
      priority: "low",
      title: "Melhorar clareza da linguagem",
      description: "Simplificar termos técnicos para melhor compreensão",
      regulation: "Princípio da Transparência", 
      affectedPolicies: 1
    }
  ]
};

export function CompanyDashboard({ companyData, onNewAnalysis, onViewAnalysis, onManageDocuments, onHome }: CompanyDashboardProps) {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red bg-red/10 border-red/20";
      case "medium": return "text-orange bg-orange/10 border-orange/20";
      case "low": return "text-blue bg-blue/10 border-blue/20";
      default: return "text-gray-2 bg-gray-1/10 border-gray-1/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "text-red";
      case "medium": return "text-orange";
      case "low": return "text-green";
      default: return "text-gray-2";
    }
  };

  const getRegulationBadge = (regulation: string) => {
    const colors = {
      lgpd: "bg-blue/20 text-blue",
      gdpr: "bg-green/20 text-green", 
      ccpa: "bg-orange/20 text-orange"
    };
    return colors[regulation] || "bg-gray-1/20 text-gray-2";
  };

  return (
    <>
      <Navbar 
        onHome={onHome}
        showBack={false}
        title={`Dashboard - ${companyData.name}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Dashboard Executivo</h1>
            <p className="text-xl text-gray-2">
              Visão geral da conformidade de privacidade - {companyData.name}
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue/20 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-2">Políticas Ativas</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.totalPolicies}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="text-sm text-gray-2">Score Médio</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.averageScore}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red" />
                </div>
                <div>
                  <p className="text-sm text-gray-2">Alertas Ativos</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.activeAlerts}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="strong" className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-2">Última Análise</p>
                  <p className="text-sm font-medium">{dashboardData.overview.lastUpdate}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Compliance Overview */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard variant="strong" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Conformidade por Regulamentação</h3>
                  <Button variant="outline" size="sm" className="border-white/20 bg-white/10 hover:bg-white/20">
                    <Download className="w-4 h-4 mr-2" />
                    Relatório
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(dashboardData.compliance).map(([reg, data]) => (
                    <div key={reg} className="text-center space-y-4">
                      <ScoreGauge score={data.score} size="md" />
                      <div>
                        <h4 className="font-semibold text-sm uppercase">{reg}</h4>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <TrendingUp className={`w-4 h-4 ${data.trend === 'up' ? 'text-green' : 'text-red'}`} />
                          <span className="text-sm text-gray-2">{data.issues} issues</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Recent Analyses */}
              <GlassCard variant="strong" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Análises Recentes</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={onManageDocuments}
                      variant="outline"
                      size="sm"
                      className="border-white/20 bg-white/10 hover:bg-white/20"
                    >
                      <FileCheck className="w-4 h-4 mr-2" />
                      Documentos
                    </Button>
                    <Button 
                      onClick={onNewAnalysis}
                      className="bg-gradient-primary hover:opacity-90 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Análise
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentAnalyses.map(analysis => (
                    <div 
                      key={analysis.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => onViewAnalysis(analysis.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{analysis.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-2">{analysis.date}</span>
                            <div className="flex space-x-1">
                              {analysis.regulations.map(reg => (
                                <Badge key={reg} className={`text-xs ${getRegulationBadge(reg)}`}>
                                  {reg.toUpperCase()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getStatusColor(analysis.status)}`}>
                            {analysis.score}
                          </div>
                          <div className="text-xs text-gray-2">Score</div>
                        </div>
                        <Eye className="w-4 h-4 text-gray-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Priority Actions */}
            <div className="space-y-6">
              <GlassCard variant="strong" className="p-6">
                <h3 className="text-xl font-semibold mb-6">Ações Prioritárias</h3>
                
                <div className="space-y-4">
                  {dashboardData.priorityActions.map((action, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-1.5 rounded border ${getPriorityColor(action.priority)}`}>
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{action.title}</h4>
                            <p className="text-gray-2 text-xs mt-1">{action.description}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </Badge>
                      </div>
                      
                      <div className="ml-9 space-y-2">
                        <div className="bg-blue/5 p-2 rounded border border-blue/10">
                          <p className="text-xs text-blue">
                            <strong>Base legal:</strong> {action.regulation}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-2">
                          <Users className="w-3 h-3" />
                          <span>{action.affectedPolicies} política(s) afetada(s)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Stats */}
              <GlassCard variant="strong" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-2">Setor</span>
                    <Badge variant="outline">{companyData.sector}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-2">Porte</span>
                    <span className="text-sm font-medium">{companyData.size.split(' ')[0]}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-2">Regulamentações</span>
                    <div className="flex space-x-1">
                      {companyData.regulations.map(reg => (
                        <Badge key={reg} className={`text-xs ${getRegulationBadge(reg)}`}>
                          {reg.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-2">Precisão da IA</span>
                    <span className="text-sm font-bold text-green">98%</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}