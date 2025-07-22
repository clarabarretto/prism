import { useState, useCallback } from "react";
import { Upload, File, Trash2, FileText, Shield, Users, Gavel, AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentFile {
  id: string;
  file: File;
  category: string;
  uploadProgress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

interface DocumentUploadProps {
  onUploadComplete: (documents: DocumentFile[]) => void;
  maxFiles?: number;
}

const documentCategories = [
  { id: "privacy-policy", name: "Política de Privacidade", icon: Shield },
  { id: "terms-of-service", name: "Termos de Uso", icon: FileText },
  { id: "data-processing", name: "Contratos de Processamento", icon: Users },
  { id: "legal-basis", name: "Base Legal LGPD", icon: Gavel },
  { id: "other", name: "Outros Documentos", icon: File }
];

export function DocumentUpload({ onUploadComplete, maxFiles = 10 }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const remainingSlots = maxFiles - documents.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newDocuments: DocumentFile[] = filesToAdd.map(file => ({
      id: Date.now() + Math.random().toString(36),
      file,
      category: "", // Will be set by user
      uploadProgress: 0,
      status: "pending"
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateDocumentCategory = (id: string, category: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, category } : doc
      )
    );
  };

  const simulateUpload = async () => {
    setIsUploading(true);

    // Check if all documents have categories
    const uncategorizedDocs = documents.filter(doc => !doc.category);
    if (uncategorizedDocs.length > 0) {
      alert("Por favor, selecione a categoria para todos os documentos");
      setIsUploading(false);
      return;
    }

    // Simulate upload progress
    for (let i = 0; i < documents.length; i++) {
      setDocuments(prev => 
        prev.map((doc, index) => 
          index === i ? { ...doc, status: "uploading" } : doc
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDocuments(prev => 
          prev.map((doc, index) => 
            index === i ? { ...doc, uploadProgress: progress } : doc
          )
        );
      }

      setDocuments(prev => 
        prev.map((doc, index) => 
          index === i ? { ...doc, status: "completed" } : doc
        )
      );
    }

    setIsUploading(false);
    onUploadComplete(documents);
  };

  const getStatusIcon = (status: DocumentFile["status"]) => {
    switch (status) {
      case "completed":
        return <div className="w-3 h-3 bg-green rounded-full" />;
      case "uploading":
        return <div className="w-3 h-3 bg-blue rounded-full animate-pulse" />;
      case "error":
        return <AlertCircle className="w-3 h-3 text-red" />;
      default:
        return <div className="w-3 h-3 bg-gray-2 rounded-full" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <GlassCard variant="default" className="p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? "border-blue bg-blue/5 scale-105" 
              : "border-gray-2 hover:border-blue/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Adicionar Documentos
              </h3>
              <p className="text-gray-2 mb-4">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-2">
                Até {maxFiles} arquivos • PDF, DOC, DOCX, TXT • Máx. 10MB cada
              </p>
            </div>
            
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              variant="outline"
              className="mt-4"
            >
              Selecionar Arquivos
            </Button>
            
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      </GlassCard>

      {/* Document List */}
      {documents.length > 0 && (
        <GlassCard variant="default" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Documentos Selecionados ({documents.length}/{maxFiles})
              </h3>
              {documents.length > 0 && (
                <Button
                  onClick={() => setDocuments([])}
                  variant="ghost"
                  size="sm"
                  className="text-red hover:text-red hover:bg-red/10"
                >
                  Limpar Todos
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {documents.map((doc) => {
                const categoryInfo = documentCategories.find(cat => cat.id === doc.category);
                const CategoryIcon = categoryInfo?.icon || File;

                return (
                  <div key={doc.id} className="flex items-center space-x-4 p-4 bg-background/50 rounded-lg">
                    {/* Status & Icon */}
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      <CategoryIcon className="w-5 h-5 text-gray-2" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {doc.file.name}
                        </p>
                        <p className="text-xs text-gray-2">
                          {formatFileSize(doc.file.size)}
                        </p>
                      </div>

                      {/* Category Selection */}
                      <Select
                        value={doc.category}
                        onValueChange={(value) => updateDocumentCategory(doc.id, value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Upload Progress */}
                      {doc.status === "uploading" && (
                        <Progress value={doc.uploadProgress} className="mt-2 h-1" />
                      )}
                    </div>

                    {/* Category Badge */}
                    {categoryInfo && (
                      <Badge variant="outline" className="text-xs">
                        {categoryInfo.name}
                      </Badge>
                    )}

                    {/* Remove Button */}
                    <Button
                      onClick={() => removeDocument(doc.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red hover:text-red hover:bg-red/10"
                      disabled={isUploading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            <div className="pt-4 border-t border-white/10">
              <Button
                onClick={simulateUpload}
                disabled={documents.length === 0 || isUploading || documents.some(doc => !doc.category)}
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
              >
                {isUploading ? "Enviando..." : `Enviar ${documents.length} documento${documents.length !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Category Legend */}
      <GlassCard variant="default" className="p-6">
        <h4 className="text-sm font-semibold mb-3">Categorias de Documentos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="flex items-center space-x-2 text-sm">
                <Icon className="w-4 h-4 text-gray-2" />
                <span>{category.name}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}