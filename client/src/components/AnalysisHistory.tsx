import { useState, useEffect } from "react";
import { Clock, FileText, Eye, Download, Trash2, Search } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";
import { ScoreGauge } from "./ScoreGauge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listAnalyses, getAnalysis } from "@/services/api";

interface HistoryItem {
        id: string;
        name: string;
        type: string;
        source: string;
        score: number;
        riskLevel: "high" | "medium" | "low";
        date: string;
        time: string;
        duration: string;
        issues: string[];
        size: string;
}

interface AnalysisHistoryProps {
        profileType: "user" | "company";
        onViewAnalysis: (analysisId: string) => void;
        onNewAnalysis: () => void;
        onBack: () => void;
        onHome: () => void;
}

export function AnalysisHistory({ profileType, onViewAnalysis, onNewAnalysis, onBack, onHome }: AnalysisHistoryProps) {
        const [searchTerm, setSearchTerm] = useState("");
        const [selectedRisk, setSelectedRisk] = useState<string>("all");
        const [history, setHistory] = useState<HistoryItem[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const fetchHistory = async () => {
                        try {
                                const files = await listAnalyses();
                                const items: HistoryItem[] = [];
                                for (const file of files) {
                                        const detail = await getAnalysis(file.filename);
                                        const timestamp: string = detail?.analise_info?.timestamp || "";
                                        const [date, time] = timestamp ? timestamp.split("T") : ["", ""];
                                        const score = (detail?.pontuacao_geral as number) || 0;
                                        const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
                                        items.push({
                                                id: file.filename,
                                                name: (detail?.empresa as string) || file.filename,
                                                type: (detail?.analise_info?.fonte as string) || "file",
                                                source: (detail?.analise_info?.url as string) || file.filename,
                                                score,
                                                riskLevel,
                                                date,
                                                time: time ? time.slice(0,5) : "",
                                                duration: "",
                                                issues: [],
                                                size: ""
                                        });
                                }
                                setHistory(items);
                        } catch (err) {
                                console.error("Failed to load history", err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchHistory();
        }, []);

        const riskFilters = [
                { value: "all", label: "Todos os Riscos", count: history.length },
                { value: "high", label: "Alto Risco", count: history.filter(h => h.riskLevel === "high").length },
                { value: "medium", label: "Risco Medio", count: history.filter(h => h.riskLevel === "medium").length },
                { value: "low", label: "Baixo Risco", count: history.filter(h => h.riskLevel === "low").length }
        ];

        const filteredHistory = history.filter(analysis => {
                const matchesSearch = analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        analysis.source.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRisk = selectedRisk === "all" || analysis.riskLevel === selectedRisk;
                return matchesSearch && matchesRisk;
        });

	const getRiskColor = (riskLevel: string) => {
		switch (riskLevel) {
			case "high": return "text-red";
			case "medium": return "text-orange";
			case "low": return "text-green";
			default: return "text-gray-2";
		}
	};

	const getRiskBadgeColor = (riskLevel: string) => {
		switch (riskLevel) {
			case "high": return "text-red bg-red/10 border-red/20";
			case "medium": return "text-orange bg-orange/10 border-orange/20";
			case "low": return "text-green bg-green/10 border-green/20";
			default: return "text-gray-2 bg-gray-1/10 border-gray-1/20";
		}
	};

	const getTypeIcon = (type: string) => {
		return type === "file" ? <FileText className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
	};

	return (
		<>
			<Navbar
				onHome={onHome}
				onBack={onBack}
				showBack={true}
				title="Histórico de Análises"
			/>

			<div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
				<div className="max-w-6xl mx-auto space-y-8">

					{/* Header */}
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold">Histórico de Análises</h1>
						<p className="text-xl text-gray-2">
							Revise suas análises anteriores e acompanhe a evolução dos riscos
						</p>
					</div>

					{/* Stats Overview */}
					<div className="grid md:grid-cols-4 gap-4">
						{riskFilters.map(filter => (
							<GlassCard
								key={filter.value}
								variant="strong"
								interactive
								onClick={() => setSelectedRisk(filter.value)}
								className={`p-4 text-center cursor-pointer transition-all duration-300 ${selectedRisk === filter.value ? "border-blue bg-blue/20" : ""
									}`}
							>
								<div className="text-2xl font-bold">{filter.count}</div>
								<div className="text-sm text-gray-2">{filter.label}</div>
							</GlassCard>
						))}
					</div>

					{/* Search and Actions */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-2" />
							<Input
								placeholder="Buscar por nome ou fonte..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-2"
							/>
						</div>
						<Button
							onClick={onNewAnalysis}
							className="bg-gradient-primary hover:opacity-90 text-white px-6"
						>
							Nova Análise
						</Button>
					</div>

					{/* History List */}
					<div className="space-y-4">
                                                {loading ? (
                                                        <GlassCard variant="strong" className="p-12 text-center">
                                                                <div className="space-y-4">
                                                                        <FileText className="w-16 h-16 mx-auto text-gray-2 opacity-50" />
                                                                        <h3 className="text-xl font-semibold">Carregando histórico...</h3>
                                                                </div>
                                                        </GlassCard>
                                                ) : filteredHistory.length === 0 ? (
                                                        <GlassCard variant="strong" className="p-12 text-center">
                                                                <div className="space-y-4">
                                                                        <FileText className="w-16 h-16 mx-auto text-gray-2 opacity-50" />
									<div>
										<h3 className="text-xl font-semibold">Nenhuma análise encontrada</h3>
										<p className="text-gray-2 mt-2">
											{searchTerm ? "Tente ajustar os filtros de busca" : "Comece fazendo sua primeira análise"}
										</p>
									</div>
									<Button
										onClick={onNewAnalysis}
										className="bg-gradient-primary hover:opacity-90 text-white"
									>
										Primeira Análise
									</Button>
								</div>
							</GlassCard>
						) : (
                                                        filteredHistory.map((analysis) => (
								<GlassCard
									key={analysis.id}
									variant="strong"
									className="p-6 hover:scale-[1.01] transition-transform duration-300"
								>
									<div className="flex items-center space-x-6">
										{/* Score Gauge */}
										<div className="flex-shrink-0">
											<ScoreGauge score={analysis.score} size="sm" showAnimation={false} />
										</div>

										{/* Analysis Info */}
										<div className="flex-1 space-y-3">
											<div className="flex items-start justify-between">
												<div>
													<h3 className="text-lg font-semibold">{analysis.name}</h3>
													<div className="flex items-center space-x-2 mt-1">
														{getTypeIcon(analysis.type)}
														<span className="text-sm text-gray-2">{analysis.source}</span>
														<Badge variant="outline" className="text-xs">
															{analysis.size}
														</Badge>
													</div>
												</div>

												<div className="text-right">
													<Badge className={`${getRiskBadgeColor(analysis.riskLevel)}`}>
														{analysis.riskLevel === "high" ? "Alto Risco" :
															analysis.riskLevel === "medium" ? "Risco Medio" : "Baixo Risco"}
													</Badge>
													<div className="text-xs text-gray-2 mt-1">
														{analysis.date} • {analysis.time}
													</div>
												</div>
											</div>

											{/* Issues Preview */}
											{analysis.issues.length > 0 && (
												<div className="space-y-2">
													<h4 className="text-sm font-medium">Principais Issues:</h4>
													<div className="flex flex-wrap gap-2">
														{analysis.issues.slice(0, 3).map((issue, index) => (
															<Badge
																key={index}
																variant="outline"
																className="text-xs text-gray-2 bg-gray-1/10"
															>
																{issue}
															</Badge>
														))}
														{analysis.issues.length > 3 && (
															<Badge variant="outline" className="text-xs text-gray-2">
																+{analysis.issues.length - 3} mais
															</Badge>
														)}
													</div>
												</div>
											)}

											{/* Analysis Meta */}
											<div className="flex items-center justify-between text-xs text-gray-2">
												<div className="flex items-center space-x-4">
													<span>Duração: {analysis.duration}</span>
													<span>Score: {analysis.score}/100</span>
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="flex flex-col space-y-2">
											<Button
												size="sm"
												onClick={() => onViewAnalysis(analysis.id)}
												className="bg-blue/20 hover:bg-blue/30 text-blue border-blue/20"
											>
												<Eye className="w-4 h-4 mr-2" />
												Ver
											</Button>

											<Button
												size="sm"
												variant="outline"
												className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
											>
												<Download className="w-4 h-4 mr-2" />
												PDF
											</Button>

											{profileType === "company" && (
												<Button
													size="sm"
													variant="outline"
													className="border-red/20 bg-red/10 hover:bg-red/20 text-red"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											)}
										</div>
									</div>
								</GlassCard>
							))
						)}
					</div>

					{/* Summary Stats */}
					<GlassCard variant="strong" className="p-6">
                                                <div className="grid md:grid-cols-4 gap-6 text-center">
                                                        <div>
                                                                <div className="text-2xl font-bold text-blue">{history.length}</div>
                                                                <div className="text-sm text-gray-2">Total de Análises</div>
                                                        </div>
                                                        <div>
                                                                <div className="text-2xl font-bold text-orange">
                                                                        {history.length ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length) : 0}
                                                                </div>
                                                                <div className="text-sm text-gray-2">Score Médio</div>
                                                        </div>
                                                        <div>
                                                                <div className="text-2xl font-bold text-green">
                                                                        {history.filter(h => h.riskLevel === "low").length}
                                                                </div>
                                                                <div className="text-sm text-gray-2">Políticas Seguras</div>
                                                        </div>
                                                        <div>
                                                                <div className="text-2xl font-bold text-red">
                                                                        {history.filter(h => h.riskLevel === "high").length}
                                                                </div>
                                                                <div className="text-sm text-gray-2">Alto Risco</div>
                                                        </div>
                                                </div>
					</GlassCard>
				</div>
			</div>
		</>
	);
}