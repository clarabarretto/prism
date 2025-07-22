import { useState } from "react";
import { Building2, Mail, Lock, ArrowRight, User } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onRegister: () => void;
  onBack: () => void;
  onHome: () => void;
}

export function CompanyLogin({ onLogin, onRegister, onBack, onHome }: CompanyLoginProps) {
  const [loginMode, setLoginMode] = useState<"select" | "login">("select");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (loginMode === "login") {
    return (
      <>
        <Navbar 
          onHome={onHome}
          onBack={() => setLoginMode("select")}
          showBack={true}
          title="Login Empresarial"
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange to-red rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Acesso Empresarial</h1>
              <p className="text-gray-2">
                Entre com suas credenciais para acessar o dashboard
              </p>
            </div>

            {/* Login Form */}
            <GlassCard variant="strong" className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email empresarial
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="empresa@exemplo.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-2" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange to-red hover:from-orange/90 hover:to-red/90"
                >
                  Entrar no Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Forgot Password */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-2 hover:text-foreground transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-2 text-sm">
                Primeira vez no Prism?{" "}
                <button
                  onClick={onRegister}
                  className="text-orange hover:text-orange/80 font-medium transition-colors"
                >
                  Criar conta empresarial
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar 
        onHome={onHome}
        onBack={onBack}
        showBack={true}
        title="Acesso Empresarial"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange to-red rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Acesso Empresarial</h1>
            <p className="text-xl text-gray-2">
              Como você gostaria de prosseguir?
            </p>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Existing Account */}
            <GlassCard 
              variant="strong" 
              interactive
              className="p-8 text-center space-y-6 group"
              onClick={() => setLoginMode("login")}
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue to-blue/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">Já tenho cadastro</h3>
                <p className="text-gray-2 leading-relaxed">
                  Acesse meu dashboard empresarial existente
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full"></div>
                  <span>Dashboard completo</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full"></div>
                  <span>Histórico preservado</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue rounded-full"></div>
                  <span>Configurações salvas</span>
                </div>
              </div>
            </GlassCard>

            {/* New Account */}
            <GlassCard 
              variant="strong" 
              interactive
              className="p-8 text-center space-y-6 group"
              onClick={onRegister}
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green to-green/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">Primeiro acesso</h3>
                <p className="text-gray-2 leading-relaxed">
                  Criar nova conta empresarial no Prism
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green rounded-full"></div>
                  <span>Setup guiado</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green rounded-full"></div>
                  <span>Dashboard personalizado</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green rounded-full"></div>
                  <span>Conformidade LGPD/GDPR</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-2 text-sm">
              Processamento seguro • Conformidade total • Suporte dedicado
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
