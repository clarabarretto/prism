import { useState, useCallback } from "react";
import { Upload, Link2, FileText, AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadSectionProps {
  profileType: "user" | "company";
  onFileAnalysis: (data: { type: "file" | "url", content: string, filename?: string }) => void;
  onBack: () => void;
  onHome: () => void;
}

export function UploadSection({ profileType, onFileAnalysis, onBack, onHome }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    setUploading(true);
    
    // Simulate file reading
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        onFileAnalysis({
          type: "file",
          content: reader.result as string,
          filename: file.name
        });
        setUploading(false);
      }, 1000);
    };
    reader.readAsText(file);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) {
      setUrlError("Por favor, insira uma URL");
      return;
    }
    
    if (!validateUrl(url)) {
      setUrlError("URL inválida");
      return;
    }
    
    setUrlError("");
    setUploading(true);
    
    // Simulate URL processing
    setTimeout(() => {
      onFileAnalysis({
        type: "url",
        content: url
      });
      setUploading(false);
    }, 1500);
  };

  return (
    <>
      <Navbar 
        onHome={onHome} 
        onBack={onBack}
        showBack={true}
        title={profileType === "user" ? "Análise de Privacidade" : "Auditoria Empresarial"}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {profileType === "user" ? "Análise de Privacidade" : "Auditoria Empresarial"}
          </h1>
          <p className="text-xl text-gray-2 max-w-2xl mx-auto">
            {profileType === "user" 
              ? "Envie a política de privacidade que deseja analisar"
              : "Faça upload da sua política atual para auditoria completa"
            }
          </p>
        </div>

        {/* Upload Methods */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* File Upload */}
          <GlassCard variant="strong" className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto text-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload de Arquivo</h3>
                <p className="text-gray-2">PDF, DOC, DOCX ou TXT</p>
              </div>

              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                  ${dragActive ? "border-blue bg-blue/10" : "border-gray-2/30 hover:border-blue/50"}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 mx-auto text-gray-2 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {dragActive ? "Solte o arquivo aqui" : "Arraste e solte ou clique para selecionar"}
                </p>
                <p className="text-sm text-gray-2">Até 10MB</p>
                
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  disabled={uploading}
                />
              </div>
            </div>
          </GlassCard>

          {/* URL Input */}
          <GlassCard variant="strong" className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <Link2 className="w-12 h-12 mx-auto text-green mb-4" />
                <h3 className="text-xl font-semibold mb-2">Link da Política</h3>
                <p className="text-gray-2">URL da página de privacidade</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    type="url"
                    placeholder="https://exemplo.com/privacidade"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setUrlError("");
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-2"
                    disabled={uploading}
                  />
                  {urlError && (
                    <div className="flex items-center space-x-2 mt-2 text-red text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{urlError}</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleUrlSubmit}
                  disabled={uploading || !url.trim()}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-3 rounded-xl"
                >
                  {uploading ? "Processando..." : "Analisar URL"}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-2">
                <p>Exemplos comuns:</p>
                <p className="mt-1">Instagram, Facebook, Google, TikTok</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green rounded-full"></div>
              <span>Análise em 30 segundos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue rounded-full"></div>
              <span>IA especializada em LGPD</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange rounded-full"></div>
              <span>Dados não armazenados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}