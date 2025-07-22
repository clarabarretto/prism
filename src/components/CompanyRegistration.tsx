import { useState } from "react";
import { Building2, Users, MapPin, Factory } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyRegistrationProps {
  onComplete: (companyData: CompanyData) => void;
  onBack: () => void;
  onHome: () => void;
}

export interface CompanyData {
  name: string;
  sector: string;
  size: string;
  country: string;
  regulations: string[];
}

const sectors = [
  "Tecnologia",
  "Financeiro", 
  "Saúde",
  "E-commerce",
  "Educação",
  "Telecomunicações",
  "Governo",
  "Mídia",
  "Varejo",
  "Serviços",
  "Outro"
];

const companySizes = [
  "Startup (1-10 funcionários)",
  "Pequena (11-50 funcionários)", 
  "Média (51-200 funcionários)",
  "Grande (201-1000 funcionários)",
  "Corporação (1000+ funcionários)"
];

const regulations = [
  { id: "lgpd", name: "LGPD (Brasil)", description: "Lei Geral de Proteção de Dados" },
  { id: "gdpr", name: "GDPR (União Europeia)", description: "General Data Protection Regulation" },
  { id: "ccpa", name: "CCPA (Califórnia)", description: "California Consumer Privacy Act" },
  { id: "pipeda", name: "PIPEDA (Canadá)", description: "Personal Information Protection Act" }
];

export function CompanyRegistration({ onComplete, onBack, onHome }: CompanyRegistrationProps) {
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    sector: "",
    size: "",
    country: "Brasil",
    regulations: ["lgpd"]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome da empresa é obrigatório";
    }
    
    if (!formData.sector) {
      newErrors.sector = "Setor é obrigatório";
    }
    
    if (!formData.size) {
      newErrors.size = "Porte da empresa é obrigatório";
    }
    
    if (formData.regulations.length === 0) {
      newErrors.regulations = "Selecione pelo menos uma regulamentação";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const toggleRegulation = (regulationId: string) => {
    setFormData(prev => ({
      ...prev,
      regulations: prev.regulations.includes(regulationId)
        ? prev.regulations.filter(id => id !== regulationId)
        : [...prev.regulations, regulationId]
    }));
  };

  return (
    <>
      <Navbar 
        onHome={onHome}
        onBack={onBack}
        showBack={true}
        title="Cadastro Empresarial"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
        <div className="max-w-2xl w-full">
          <GlassCard variant="strong" className="p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue to-purple-500 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Dados da Empresa</h2>
                  <p className="text-gray-2 mt-2">
                    Informe os dados para personalizar a análise de conformidade
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nome da Empresa *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: TechCorp Ltda"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-2"
                  />
                  {errors.name && (
                    <p className="text-red text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Sector and Size */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Setor *
                    </Label>
                    <Select value={formData.sector} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, sector: value }))
                    }>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map(sector => (
                          <SelectItem key={sector} value={sector}>
                            <div className="flex items-center space-x-2">
                              <Factory className="w-4 h-4" />
                              <span>{sector}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sector && (
                      <p className="text-red text-sm">{errors.sector}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Porte da Empresa *
                    </Label>
                    <Select value={formData.size} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, size: value }))
                    }>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map(size => (
                          <SelectItem key={size} value={size}>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{size}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.size && (
                      <p className="text-red text-sm">{errors.size}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    País de Operação
                  </Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-2"
                  />
                </div>

                {/* Regulations */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground font-medium">
                      Regulamentações de Interesse *
                    </Label>
                    <p className="text-gray-2 text-sm mt-1">
                      Selecione as regulamentações que sua empresa deve seguir
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {regulations.map(regulation => (
                      <GlassCard
                        key={regulation.id}
                        interactive
                        onClick={() => toggleRegulation(regulation.id)}
                        className={`p-4 cursor-pointer transition-all duration-300 ${
                          formData.regulations.includes(regulation.id)
                            ? "border-blue bg-blue/20"
                            : "hover:border-blue/50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            formData.regulations.includes(regulation.id)
                              ? "border-blue bg-blue"
                              : "border-gray-2"
                          }`}>
                            {formData.regulations.includes(regulation.id) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{regulation.name}</h4>
                            <p className="text-gray-2 text-xs mt-1">{regulation.description}</p>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                  {errors.regulations && (
                    <p className="text-red text-sm">{errors.regulations}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-3 rounded-xl"
                  >
                    Continuar para Análise
                  </Button>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center text-xs text-gray-2">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Dados seguros</span>
                  </div>
                  <span>•</span>
                  <span>Não compartilhados</span>
                  <span>•</span>
                  <span>LGPD compliant</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}