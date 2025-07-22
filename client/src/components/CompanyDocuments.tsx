import { useState } from "react";
import { FileText, Download, Eye, Trash2, Upload, Filter, Search, Calendar } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { DocumentUpload } from "./DocumentUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyDocument {
	id: string;
	name: string;
	category: string;
	uploadDate: string;
	size: string;
	status: "active" | "pending" | "expired";
	lastAnalysis?: string;
	riskScore?: number;
}

interface CompanyDocumentsProps {
	onBack: () => void;
	onHome: () => void;
	onAnalyzeDocument: (documentId: string) => void;
}

const mockDocuments: CompanyDocument[] = [
	{
		id: "1",
		name: "Política de Privacidade Principal",
		category: "privacy-policy",
		uploadDate: "2024-01-15",
		size: "245 KB",
		status: "active",
		lastAnalysis: "2024-01-20",
		riskScore: 85
	},
	{
		id: "2",
		name: "Termos de Uso do App",
		category: "terms-of-service",
		uploadDate: "2024-01-10",
		size: "156 KB",
		status: "active",
		lastAnalysis: "2024-01-18",
		riskScore: 62
	},
	{
		id: "3",
		name: "Contrato de Processamento - AWS",
		category: "data-processing",
		uploadDate: "2024-01-05",
		size: "1.2 MB",
		status: "pending",
	},
	{
		id: "4",
		name: "Base Legal Art. 7º LGPD",
		category: "legal-basis",
		uploadDate: "2023-12-20",
		size: "89 KB",
		status: "expired",
		lastAnalysis: "2023-12-25",
		riskScore: 28
	}
];

const categoryNames = {
	"privacy-policy": "Política de Privacidade",
	"terms-of-service": "Termos de Uso",
	"data-processing": "Contratos de Processamento",
	"legal-basis": "Base Legal LGPD",
	"other": "Outros Documentos"
};

export function CompanyDocuments({ onBack, onHome, onAnalyzeDocument }: CompanyDocumentsProps) {
	const [documents, setDocuments] = useState<CompanyDocument[]>(mockDocuments);
	const [showUpload, setShowUpload] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	const handleUploadComplete = (uploadedFiles: any[]) => {
		// Convert uploaded files to document format
		const newDocuments: CompanyDocument[] = uploadedFiles.map(file => ({
			id: Date.now() + Math.random().toString(36),
			name: file.file.name,
			category: file.category,
			uploadDate: new Date().toISOString().split('T')[0],
			size: formatFileSize(file.file.size),
			status: "pending" as const,
		}));

		setDocuments(prev => [...newDocuments, ...prev]);
		setShowUpload(false);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active": return "bg-green text-white";
			case "pending": return "bg-yellow text-black";
			case "expired": return "bg-red text-white";
			default: return "bg-gray-2 text-white";
		}
	};

	const getRiskColor = (score?: number) => {
		if (!score) return "text-gray-2";
		if (score >= 70) return "text-red";
		if (score >= 40) return "text-yellow";
		return "text-green";
	};

	const filteredDocuments = documents.filter(doc => {
		const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
		const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
		return matchesSearch && matchesCategory && matchesStatus;
	});

	const handleDeleteDocument = (id: string) => {
		setDocuments(prev => prev.filter(doc => doc.id !== id));
	};

	if (showUpload) {
		return (
			<>
				<Navbar
					onHome={onHome}
					onBack={() => setShowUpload(false)}
					showBack={true}
					title="Adicionar Documentos"
				/>

				<div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
					<div className="max-w-4xl mx-auto space-y-6">
						<div className="text-center space-y-4">
							<h1 className="text-3xl font-bold">Adicionar Documentos</h1>
							<p className="text-gray-2">
								Faça upload dos documentos da sua empresa para análise de conformidade
							</p>
						</div>

						<DocumentUpload
							onUploadComplete={handleUploadComplete}
							maxFiles={10}
						/>
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
				title="Documentos da Empresa"
			/>

			<div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
				<div className="max-w-6xl mx-auto space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Documentos da Empresa</h1>
							<p className="text-gray-2">
								Gerencie e analise os documentos de conformidade
							</p>
						</div>
						<Button
							onClick={() => setShowUpload(true)}
							className="bg-gradient-primary hover:bg-gradient-primary/90"
						>
							<Upload className="w-4 h-4 mr-2" />
							Adicionar Documentos
						</Button>
					</div>

					{/* Filters */}
					<GlassCard variant="default" className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{/* Search */}
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-2" />
								<Input
									placeholder="Buscar documentos..."
									className="pl-10"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>

							{/* Category Filter */}
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Categoria" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todas Categorias</SelectItem>
									{Object.entries(categoryNames).map(([id, name]) => (
										<SelectItem key={id} value={id}>{name}</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Status Filter */}
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos Status</SelectItem>
									<SelectItem value="active">Ativo</SelectItem>
									<SelectItem value="pending">Pendente</SelectItem>
									<SelectItem value="expired">Expirado</SelectItem>
								</SelectContent>
							</Select>

							{/* Results */}
							<div className="flex items-center text-sm text-gray-2">
								{filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
							</div>
						</div>
					</GlassCard>

					{/* Documents Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{filteredDocuments.map((doc) => (
							<GlassCard key={doc.id} variant="strong" className="p-6">
								<div className="space-y-4">
									{/* Header */}
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-3">
											<div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
												<FileText className="w-5 h-5 text-white" />
											</div>
											<div>
												<h3 className="font-semibold text-sm">{doc.name}</h3>
												<p className="text-xs text-gray-2">
													{categoryNames[doc.category as keyof typeof categoryNames]}
												</p>
											</div>
										</div>
										<Badge
											className={`text-xs ${getStatusColor(doc.status)}`}
										>
											{doc.status === "active" ? "Ativo" :
												doc.status === "pending" ? "Pendente" : "Expirado"}
										</Badge>
									</div>

									{/* Details */}
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<p className="text-gray-2">Data Upload</p>
											<p className="font-medium">
												{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
											</p>
										</div>
										<div>
											<p className="text-gray-2">Tamanho</p>
											<p className="font-medium">{doc.size}</p>
										</div>
										{doc.lastAnalysis && (
											<>
												<div>
													<p className="text-gray-2">Última Análise</p>
													<p className="font-medium">
														{new Date(doc.lastAnalysis).toLocaleDateString('pt-BR')}
													</p>
												</div>
												<div>
													<p className="text-gray-2">Score de Risco</p>
													<p className={`font-bold ${getRiskColor(doc.riskScore)}`}>
														{doc.riskScore}/100
													</p>
												</div>
											</>
										)}
									</div>

									{/* Actions */}
									<div className="flex items-center space-x-2 pt-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => onAnalyzeDocument(doc.id)}
										>
											<Eye className="w-3 h-3 mr-1" />
											Analisar
										</Button>
										<Button
											size="sm"
											variant="outline"
										>
											<Download className="w-3 h-3 mr-1" />
											Download
										</Button>
										<Button
											size="sm"
											variant="ghost"
											className="text-red hover:text-red hover:bg-red/10"
											onClick={() => handleDeleteDocument(doc.id)}
										>
											<Trash2 className="w-3 h-3" />
										</Button>
									</div>
								</div>
							</GlassCard>
						))}
					</div>

					{/* Empty State */}
					{filteredDocuments.length === 0 && (
						<GlassCard variant="default" className="p-12 text-center">
							<FileText className="w-16 h-16 mx-auto text-gray-2 mb-4" />
							<h3 className="text-xl font-semibold mb-2">Nenhum documento encontrado</h3>
							<p className="text-gray-2 mb-6">
								{searchTerm || categoryFilter !== "all" || statusFilter !== "all"
									? "Ajuste os filtros ou tente outro termo de busca"
									: "Adicione documentos para começar a análise de conformidade"
								}
							</p>
							{(!searchTerm && categoryFilter === "all" && statusFilter === "all") && (
								<Button
									onClick={() => setShowUpload(true)}
									className="bg-gradient-primary hover:bg-gradient-primary/90"
								>
									<Upload className="w-4 h-4 mr-2" />
									Adicionar Primeiro Documento
								</Button>
							)}
						</GlassCard>
					)}
				</div>
			</div>
		</>
	);
}