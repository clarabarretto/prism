import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";

interface UploadSectionProps {
  profileType: "user" | "company";
  onFileAnalysis: (data: { type: "file", content: string, filename?: string }) => void;
  onBack: () => void;
  onHome: () => void;
}

export function UploadSection({ profileType, onFileAnalysis, onBack, onHome }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        <div className="flex justify-center">
          {/* File Upload */}
          <GlassCard variant="strong" className="p-8 lg:w-1/2">
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