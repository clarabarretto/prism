import { useState } from "react";
import { Download, Share2, RotateCcw, AlertTriangle, Shield, Eye, FileText } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { ScoreGauge } from "./ScoreGauge";
import { Navbar } from "./Navbar";
import { DetailedAnalysis } from "./DetailedAnalysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultsProps {
	profileType: "user" | "company";
	score: number;
	filename?: string;
	onStartNew: () => void;
	onBack?: () => void;
	onHome: () => void;
}

// Mock data para demonstração
const getMockResults = (profileType: "user" | "company", score: number) => {
	const baseResults = {
		confidence: 94,
		mainIssues: [
			{
				level: "high" as const,
				title: "Compartilhamento com terceiros",
				description: "Política permite compartilhamento de dados com 'parceiros comerciais' sem especificar quais.",
				excerpt: "Podemos compartilhar suas informações com nossos parceiros comerciais para melhorar nossos serviços...",
				recommendation: "Exija lista específica de parceiros e finalidades do compartilhamento."
			},
			{
				level: "medium" as const,
				title: "Linguagem vaga",
				description: "Uso de termos indefinidos como 'melhorar a experiência' e 'fins comerciais legítimos'.",
				excerpt: "Coletamos dados para melhorar sua experiência e outros fins comerciais legítimos...",
				recommendation: "Busque políticas com linguagem clara e específica sobre o uso dos dados."
			},
			{
				level: "medium" as const,
				title: "Período de retenção",
				description: "Não especifica por quanto tempo os dados serão mantidos.",
				excerpt: "Manteremos suas informações pelo tempo necessário para cumprir nossos objetivos...",
				recommendation: "Dados devem ter prazo específico de retenção conforme LGPD."
			}
		]
	};

	if (profileType === "company") {
		return {
			...baseResults,
			compliance: {
				lgpd: 65,
				gdpr: 58,
				ccpa: 72
			},
			actionPlan: [
				"Especificar finalidades do tratamento de dados",
				"Criar mecanismo claro de consentimento",
				"Definir prazos de retenção por categoria de dados",
				"Implementar processo de portabilidade",
				"Designar encarregado de proteção de dados"
			]
		};
	}

	return baseResults;
};

export function AnalysisResults({ profileType, score, filename, onStartNew, onBack, onHome }: AnalysisResultsProps) {
	const [activeTab, setActiveTab] = useState("overview");
	const results = getMockResults(profileType, score);

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
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green rounded-full"></div>
										<span>Confiança: {results.confidence}%</span>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-blue rounded-full"></div>
										<span>Análise em 23s</span>
									</div>
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
												<li className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-red rounded-full"></div>
													<span>Compartilhamento excessivo com terceiros</span>
												</li>
												<li className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-orange rounded-full"></div>
													<span>Linguagem vaga sobre finalidades</span>
												</li>
												<li className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-orange rounded-full"></div>
													<span>Período de retenção indefinido</span>
												</li>
											</ul>
										</div>
										<div className="space-y-3">
											<h4 className="font-medium text-green">Pontos Positivos</h4>
											<ul className="space-y-2 text-sm text-gray-2">
												<li className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green rounded-full"></div>
													<span>Direitos do usuário bem detalhados</span>
												</li>
												<li className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green rounded-full"></div>
													<span>Canal de contato para dúvidas</span>
												</li>
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

						{activeTab === "compliance" && profileType === "company" && "compliance" in results && (
							<GlassCard variant="strong" className="p-8">
								<div className="space-y-8">
									<h3 className="text-2xl font-bold text-center">Conformidade Regulatória</h3>

									<div className="grid md:grid-cols-3 gap-6">
										{[
											{ name: "LGPD", score: results.compliance.lgpd, color: "blue" },
											{ name: "GDPR", score: results.compliance.gdpr, color: "green" },
											{ name: "CCPA", score: results.compliance.ccpa, color: "orange" }
										].map((regulation) => (
											<div key={regulation.name} className="text-center space-y-4">
												<ScoreGauge score={regulation.score} size="md" />
												<h4 className="font-semibold text-lg">{regulation.name}</h4>
											</div>
										))}
									</div>

									<div className="space-y-4">
										<h4 className="text-xl font-semibold">Plano de Ação</h4>
										<div className="space-y-3">
											{results.actionPlan.map((action, index) => (
												<div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
													<div className="w-6 h-6 bg-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
														{index + 1}
													</div>
													<span>{action}</span>
												</div>
											))}
										</div>
									</div>
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
				</div>
			</div>
		</>
	);
}