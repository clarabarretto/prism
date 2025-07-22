import { useState, useEffect } from "react";
import { Brain, Shield, Search, CheckCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";

interface LoadingAnalysisProps {
  onComplete: () => void;
  onBack: () => void;
  onHome: () => void;
}

export function LoadingAnalysis({ onComplete, onBack, onHome }: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      icon: Search,
      title: "Lendo documento",
      description: "Extraindo texto e estrutura da política",
      tip: "💡 Políticas longas podem indicar tentativa de confundir o usuário"
    },
    {
      icon: Brain,
      title: "Análise com IA",
      description: "Identificando cláusulas problemáticas e riscos",
      tip: "🔍 Buscando termos vagos como 'melhorar a experiência'"
    },
    {
      icon: Shield,
      title: "Verificação LGPD",
      description: "Validando conformidade com regulamentações",
      tip: "⚖️ A LGPD exige linguagem clara e objetiva"
    },
    {
      icon: CheckCircle,
      title: "Preparando relatório",
      description: "Gerando score e recomendações personalizadas",
      tip: "📊 Score baseado em 50+ critérios de segurança"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <>
      <Navbar 
        onHome={onHome}
        onBack={onBack}
        showBack={true}
        title="Analisando..."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
      <div className="max-w-2xl w-full">
        <GlassCard variant="strong" className="p-12 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Analisando Política</h2>
            <p className="text-gray-2 text-lg">Nossa IA está examinando cada detalhe...</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`
                    flex items-start space-x-4 p-4 rounded-xl transition-all duration-500
                    ${isActive ? "bg-white/10" : "opacity-40"}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
                    ${isCompleted 
                      ? "bg-green text-white" 
                      : isActive 
                        ? "bg-gradient-primary text-white animate-pulse" 
                        : "bg-gray-1/20 text-gray-2"
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold transition-colors duration-500 ${
                      isActive ? "text-foreground" : "text-gray-2"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm transition-colors duration-500 ${
                      isActive ? "text-gray-2" : "text-gray-2/60"
                    }`}>
                      {step.description}
                    </p>
                    
                    {isActive && (
                      <div className="mt-2 p-2 bg-blue/10 rounded-lg border border-blue/20">
                        <p className="text-sm text-blue">{step.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-1/20 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <p className="text-sm text-gray-2">
            Tempo estimado: {Math.max(0, (steps.length - currentStep - 1) * 2)} segundos
          </p>
        </GlassCard>
      </div>
    </div>
    </>
  );
}