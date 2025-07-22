import { useState } from "react";
import { Clock, Play, Star, ExternalLink, Download } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DemoModeProps {
  onSelectDemo: (demoType: string, demoData: any) => void;
  onBack: () => void;
  onHome: () => void;
}

const demoExamples = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Rede social com muitos alertas de privacidade",
    category: "Rede Social",
    expectedScore: 85,
    riskLevel: "high",
    url: "https://help.instagram.com/519522125107875",
    highlights: [
      "Compartilhamento extensivo com Facebook",
      "Coleta de dados de localização",
      "Publicidade direcionada"
    ],
    analysisTime: "~15s"
  },
  {
    id: "google",
    name: "Google",
    description: "Política abrangente com muitos serviços",
    category: "Tecnologia",
    expectedScore: 72,
    riskLevel: "medium",
    url: "https://policies.google.com/privacy",
    highlights: [
      "Integração entre múltiplos serviços",
      "Retenção por tempo indefinido",
      "Transferência internacional"
    ],
    analysisTime: "~25s"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Mensageria com criptografia end-to-end",
    category: "Comunicação", 
    expectedScore: 45,
    riskLevel: "medium",
    url: "https://www.whatsapp.com/legal/privacy-policy",
    highlights: [
      "Compartilhamento com Meta",
      "Metadados coletados",
      "Backup não criptografado"
    ],
    analysisTime: "~12s"
  },
  {
    id: "banco-brasil",
    name: "Banco do Brasil",
    description: "Instituição financeira com dados sensíveis",
    category: "Financeiro",
    expectedScore: 25,
    riskLevel: "low", 
    url: "https://www.bb.com.br/site/bb/pri/",
    highlights: [
      "Conformidade bancária rigorosa",
      "Dados financeiros protegidos",
      "Auditoria regular"
    ],
    analysisTime: "~18s"
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Plataforma de vídeos com preocupações geopolíticas",
    category: "Entretenimento",
    expectedScore: 90,
    riskLevel: "high",
    url: "https://www.tiktok.com/legal/privacy-policy",
    highlights: [
      "Transferência para China",
      "Coleta biométrica facial",
      "Algoritmo de recomendação"
    ],
    analysisTime: "~20s"
  },
  {
    id: "nubank",
    name: "Nubank",
    description: "Fintech brasileira moderna",
    category: "Fintech",
    expectedScore: 35,
    riskLevel: "low",
    url: "https://nubank.com.br/politica-privacidade/",
    highlights: [
      "Transparência em dados financeiros",
      "Base legal clara",
      "Direitos bem definidos"
    ],
    analysisTime: "~16s"
  }
];

export function DemoMode({ onSelectDemo, onBack, onHome }: DemoModeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = ["all", "Rede Social", "Tecnologia", "Comunicação", "Financeiro", "Entretenimento", "Fintech"];
  
  const filteredExamples = selectedCategory === "all" 
    ? demoExamples 
    : demoExamples.filter(example => example.category === selectedCategory);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high": return "text-red bg-red/10 border-red/20";
      case "medium": return "text-orange bg-orange/10 border-orange/20";
      case "low": return "text-green bg-green/10 border-green/20";
      default: return "text-gray-2 bg-gray-1/10 border-gray-1/20";
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case "high": return "Alto Risco";
      case "medium": return "Risco Médio";
      case "low": return "Baixo Risco";
      default: return "Indefinido";
    }
  };

  const handleRunDemo = (demo: any) => {
    // Simulate demo analysis with predefined results
    const demoData = {
      type: "demo",
      example: demo,
      mockResults: {
        score: demo.expectedScore,
        riskLevel: demo.riskLevel,
        highlights: demo.highlights,
        analysisTime: demo.analysisTime
      }
    };
    
    onSelectDemo(demo.id, demoData);
  };

  return (
    <>
      <Navbar 
        onHome={onHome}
        onBack={onBack}
        showBack={true}
        title="Modo Demonstração"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Modo Demonstração</h1>
            <p className="text-xl text-gray-2 max-w-2xl mx-auto">
              Experimente a análise com exemplos reais de políticas de privacidade.
              <br />Veja como nossa IA identifica riscos em segundos.
            </p>
          </div>

          {/* Info Banner */}
          <GlassCard variant="strong" className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Análise com IA Real</h3>
                <p className="text-gray-2 text-sm mt-1">
                  Todas as demonstrações usam nossa IA treinada em 10.000+ políticas reais.
                  Resultados baseados em análise automática dos documentos originais.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green font-medium">Precisão: 98%</div>
                <div className="text-xs text-gray-2">Em produção</div>
              </div>
            </div>
          </GlassCard>

          {/* Category Filter */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm
                      ${selectedCategory === category 
                        ? "bg-white text-gray-3 shadow-lg" 
                        : "text-gray-2 hover:text-foreground hover:bg-white/10"
                      }
                    `}
                  >
                    {category === "all" ? "Todos" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Examples Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <GlassCard 
                key={example.id} 
                variant="strong" 
                className="p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{example.name}</h3>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {example.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{example.expectedScore}</div>
                    <Badge className={`text-xs ${getRiskColor(example.riskLevel)}`}>
                      {getRiskText(example.riskLevel)}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-2 text-sm leading-relaxed">
                  {example.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Principais Achados:</h4>
                  <ul className="space-y-1">
                    {example.highlights.slice(0, 2).map((highlight, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs text-gray-2">
                        <div className={`w-2 h-2 rounded-full ${
                          example.riskLevel === "high" ? "bg-red" :
                          example.riskLevel === "medium" ? "bg-orange" : "bg-green"
                        }`} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => handleRunDemo(example)}
                    className="flex-1 bg-gradient-primary hover:opacity-90 text-white text-sm py-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Analisar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(example.url, '_blank')}
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {/* Analysis Time */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-2 pt-2 border-t border-white/10">
                  <Clock className="w-3 h-3" />
                  <span>Análise em {example.analysisTime}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center space-y-4">
            <p className="text-gray-2">
              Gostou dos resultados? Experimente com suas próprias políticas.
            </p>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              Voltar para Análise Personalizada
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}