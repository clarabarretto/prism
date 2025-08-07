import { useState } from "react";
import { Download, Share2, RotateCcw, AlertTriangle, Shield, Eye, FileText } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { ScoreGauge } from "./ScoreGauge";
import { Navbar } from "./Navbar";
import { DetailedAnalysis } from "./DetailedAnalysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResponse, SummaryPoint } from "@/services/api";

interface AnalysisResultsProps {
        profileType: "user" | "company";
        score: number;
        filename?: string;
        result?: AnalysisResponse;
        analysisTime?: number;
        onStartNew: () => void;
        onBack?: () => void;
        onHome: () => void;
}

export function AnalysisResults({ profileType, score, filename, result, analysisTime, onStartNew, onBack, onHome }: AnalysisResultsProps) {
        const [activeTab, setActiveTab] = useState("overview");
        const analysis = (result as any) || {};
        const resumo = analysis.resumo_executivo || {};
        const mainIssues: (SummaryPoint | string)[] = Array.isArray(resumo.principais_problemas_identificados)
                ? resumo.principais_problemas_identificados
                : [];
        const positivePoints: (SummaryPoint | string)[] = Array.isArray(resumo.pontos_positivos)
                ? resumo.pontos_positivos
                : [];

        const getBulletColor = (level?: string, defaultColor = "bg-orange") => {
                const normalized = level?.toLowerCase();
                switch (normalized) {
                        case "high":
                        case "alto":
                                return "bg-red";
                        case "medium":
                        case "medio":
                        case "médio":
                                return "bg-orange";
                        case "low":
                        case "baixo":
                                return "bg-green";
                        default:
                                return defaultColor;
                }
        };

        const getLevelColor = (level: "high" | "medium" | "low") => {
                switch (level) {
                        case "high": return "text-red bg-red/10 border-red/20";
                        case "medium": return "text-orange bg-orange/10 border-orange/20";
                        case "low": return "text-green bg-green/10 border-green/20";
                }
	};

	const getLevelIcon = (level: "high" | "medium" | "low") => {
		switch (level) {
			case "high": return <AlertTriangle className="w-4 h-4" />;
			case "medium": return <Eye className="w-4 h-4" />;
			case "low": return <Shield className="w-4 h-4" />;
		}
	};

	return (
		<>
			<Navbar
				onHome={onHome}
				onBack={onBack}
				showBack={!!onBack}
				title="Resultado da Análise"
			/>

			<div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 p-6 pt-24">
				<div className="max-w-6xl mx-auto space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold">
							{profileType === "user" ? "Análise Concluída" : "Relatório de Auditoria"}
						</h1>
						{filename && (
							<p className="text-gray-2">
								<FileText className="inline w-4 h-4 mr-2" />
								{filename}
							</p>
						)}
					</div>

					{/* Score Section */}
					<GlassCard variant="strong" className="p-8">
						<div className="grid lg:grid-cols-3 gap-8 items-center">
							<div className="lg:col-span-1 flex justify-center">
								<ScoreGauge score={score} size="lg" />
							</div>

							<div className="lg:col-span-2 space-y-6">
								<div>
									<h2 className="text-2xl font-bold mb-2">
										{score <= 30 ? "Política Segura" : score <= 70 ? "Atenção Necessária" : "Alto Risco Detectado"}
									</h2>
									<p className="text-gray-2 text-lg leading-relaxed">
										{score <= 30
											? "Esta política oferece boa proteção aos seus dados pessoais e segue as melhores práticas de privacidade."
											: score <= 70
												? "A política apresenta alguns pontos de atenção que podem afetar sua privacidade."
												: "Esta política contém várias cláusulas problemáticas que podem comprometer significativamente sua privacidade."
										}
									</p>
								</div>

                                                                <div className="flex items-center space-x-4 text-sm text-gray-2">
                                                                        {typeof (result as any)?.confidence === "number" && (
                                                                                <div className="flex items-center space-x-2">
                                                                                        <div className="w-2 h-2 bg-green rounded-full"></div>
                                                                                        <span>
                                                                                                Confiança: {Math.round(((result as any).confidence <= 1 ? (result as any).confidence * 100 : (result as any).confidence))}%
                                                                                        </span>
                                                                                </div>
                                                                        )}
                                                                        {typeof analysisTime === "number" && (
                                                                                <div className="flex items-center space-x-2">
                                                                                        <div className="w-2 h-2 bg-blue rounded-full"></div>
                                                                                        <span>Análise em {analysisTime}s</span>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </div>
                                                </div>
                                        </GlassCard>

					{/* Tabs */}
					<div className="flex justify-center">
						<div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
							<div className="flex space-x-2">
								{[
									{ id: "overview", label: "Resumo Executivo" },
									{ id: "detailed", label: "Análise Detalhada" },
									...(profileType === "company" ? [{ id: "compliance", label: "Conformidade Legal" }] : [])
								].map((tab) => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`
                    px-6 py-3 rounded-xl font-medium transition-all duration-300
                    ${activeTab === tab.id
												? "bg-white text-gray-3 shadow-lg"
												: "text-gray-2 hover:text-foreground hover:bg-white/10"
											}
                  `}
									>
										{tab.label}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Tab Content */}
					<div className="space-y-6">
						{activeTab === "overview" && (
							<div className="space-y-6">
								{/* Executive Summary */}
								<GlassCard variant="strong" className="p-6">
									<h3 className="text-xl font-semibold mb-4">Resumo Executivo</h3>
                                                                        <div className="grid md:grid-cols-2 gap-6">
                                                                                <div className="space-y-3">
                                                                                        <h4 className="font-medium text-blue">Principais Problemas Identificados</h4>
                                                                                        <ul className="space-y-2 text-sm text-gray-2">
                                                                                                {mainIssues.map((item, idx) => (
                                                                                                        <li key={idx} className="flex items-center space-x-2">
                                                                                                                <div className={`w-2 h-2 rounded-full ${getBulletColor(item?.nivel)}`}></div>
                                                                                                                <span>{typeof item === "string" ? item : item?.descricao}</span>
                                                                                                        </li>
                                                                                                ))}
                                                                                                {mainIssues.length === 0 && (
                                                                                                        <li className="text-gray-2">Nenhum problema identificado</li>
                                                                                                )}
                                                                                        </ul>
                                                                                </div>
                                                                                <div className="space-y-3">
                                                                                        <h4 className="font-medium text-green">Pontos Positivos</h4>
                                                                                        <ul className="space-y-2 text-sm text-gray-2">
                                                                                                {positivePoints.map((item, idx) => (
                                                                                                        <li key={idx} className="flex items-center space-x-2">
                                                                                                                <div className={`w-2 h-2 rounded-full ${getBulletColor(item?.nivel, "bg-green")}`}></div>
                                                                                                                <span>{typeof item === "string" ? item : item?.descricao}</span>
                                                                                                        </li>
                                                                                                ))}
                                                                                                {positivePoints.length === 0 && (
                                                                                                        <li className="text-gray-2">Nenhum ponto positivo identificado</li>
                                                                                                )}
                                                                                        </ul>
                                                                                </div>
                                                                        </div>
                                                                </GlassCard>

								{/* Quick Actions */}
								<GlassCard variant="strong" className="p-6">
									<h3 className="text-xl font-semibold mb-4">Recomendações Imediatas</h3>
									<div className="space-y-4">
										{profileType === "user" ? (
											<>
												<div className="bg-red/10 p-4 rounded-lg border border-red/20">
													<h4 className="font-medium text-red mb-2">⚠️ Considere não aceitar esta política</h4>
													<p className="text-sm text-gray-2">O nível de risco é alto. Procure alternativas mais seguras para este serviço.</p>
												</div>
												<div className="bg-blue/10 p-4 rounded-lg border border-blue/20">
													<h4 className="font-medium text-blue mb-2">📋 Se decidir aceitar</h4>
													<ul className="text-sm text-gray-2 space-y-1">
														<li>• Desative compartilhamento de dados nas configurações</li>
														<li>• Revise periodicamente suas configurações de privacidade</li>
														<li>• Solicite cópia dos seus dados regularmente</li>
													</ul>
												</div>
											</>
										) : (
											<>
												<div className="bg-orange/10 p-4 rounded-lg border border-orange/20">
													<h4 className="font-medium text-orange mb-2">🎯 Prioridade Alta</h4>
													<p className="text-sm text-gray-2">Revisar e especificar melhor as cláusulas de compartilhamento de dados.</p>
												</div>
												<div className="bg-blue/10 p-4 rounded-lg border border-blue/20">
													<h4 className="font-medium text-blue mb-2">📝 Próximos Passos</h4>
													<ul className="text-sm text-gray-2 space-y-1">
														<li>• Definir período específico de retenção de dados</li>
														<li>• Melhorar clareza sobre finalidades de tratamento</li>
														<li>• Implementar mecanismos de consentimento granular</li>
													</ul>
												</div>
											</>
										)}
									</div>
								</GlassCard>
							</div>
						)}

						{activeTab === "detailed" && (
							<DetailedAnalysis profileType={profileType} score={score} />
						)}

                                                {activeTab === "compliance" && profileType === "company" && "compliance" in analysis && (
                                                        <GlassCard variant="strong" className="p-8">
                                                                <div className="space-y-8">
                                                                        <h3 className="text-2xl font-bold text-center">Conformidade Regulatória</h3>

                                                                        <div className="grid md:grid-cols-3 gap-6">
                                                                                {[
                                                                                        { name: "LGPD", score: analysis.compliance.lgpd, color: "blue" },
                                                                                        { name: "GDPR", score: analysis.compliance.gdpr, color: "green" },
                                                                                        { name: "CCPA", score: analysis.compliance.ccpa, color: "orange" }
                                                                                ].map((regulation) => (
                                                                                        <div key={regulation.name} className="text-center space-y-4">
                                                                                                <ScoreGauge score={regulation.score} size="md" />
                                                                                                <h4 className="font-semibold text-lg">{regulation.name}</h4>
                                                                                        </div>
                                                                                ))}
                                                                        </div>

                                                                        {Array.isArray(analysis.actionPlan) && (
                                                                                <div className="space-y-4">
                                                                                        <h4 className="text-xl font-semibold">Plano de Ação</h4>
                                                                                        <div className="space-y-3">
                                                                                                {analysis.actionPlan.map((action, index) => (
                                                                                                        <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                                                                                                                <div className="w-6 h-6 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                                                                        {index + 1}
                                                                                                                </div>
                                                                                                                <span>{action}</span>
                                                                                                        </div>
                                                                                                ))}
                                                                                        </div>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        </GlassCard>
                                                )}
					</div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap justify-center gap-4">
						<Button
							onClick={onStartNew}
							className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 rounded-xl"
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Nova Análise
						</Button>

						<Button
							variant="outline"
							className="border-white/20 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl"
						>
							<Download className="w-4 h-4 mr-2" />
							Baixar PDF
						</Button>

						<Button
							variant="outline"
							className="border-white/20 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl"
						>
							<Share2 className="w-4 h-4 mr-2" />
							Compartilhar
                                                </Button>
                                        </div>

                                        {result && (
                                                <GlassCard variant="strong" className="p-6">
                                                        <h3 className="text-xl font-semibold mb-4">Resultado bruto</h3>
                                                        <pre className="text-xs text-left whitespace-pre-wrap break-words max-h-96 overflow-auto">
                                                                {JSON.stringify(result, null, 2)}
                                                        </pre>
                                                </GlassCard>
                                        )}
                                </div>
                        </div>
                </>
        );
}