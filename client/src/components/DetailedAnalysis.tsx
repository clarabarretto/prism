import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Shield, Eye, Clock, Users, Building, MapPin } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskFactor, Principle } from "@/services/api";

interface DetailedAnalysisProps {
        profileType: "user" | "company";
        riskFactors?: RiskFactor[];
        principles?: Record<string, Principle>;
}

const normalizeLevel = (level?: string | number): "high" | "medium" | "low" => {
        if (typeof level === "number") {
                if (level >= 7) return "high";
                if (level >= 4) return "medium";
                return "low";
        }
        const l = level?.toString().toLowerCase();
        if (l === "alto" || l === "high") return "high";
        if (l === "medio" || l === "médio" || l === "medium") return "medium";
        if (l === "baixo" || l === "low") return "low";
        const num = Number(l);
        if (!isNaN(num)) {
                if (num >= 7) return "high";
                if (num >= 4) return "medium";
                return "low";
        }
        return "low";
};

const getFactorIcon = (title?: string) => {
        const t = title?.toLowerCase() || "";
        if (t.includes("sens")) return Users;
        if (t.includes("transfer")) return Building;
        if (t.includes("localiza")) return MapPin;
        if (t.includes("reten")) return Clock;
        return AlertTriangle;
};

export function DetailedAnalysis({ profileType, riskFactors, principles }: DetailedAnalysisProps) {
        const categories = Object.entries(principles || {}).map(([key, p]) => {
                const level = normalizeLevel((p as any)?.pontuacao);
                return {
                        id: key,
                        title: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                        score: typeof (p as any)?.pontuacao === "number" ? (p as any).pontuacao * 10 : 0,
                        issues: Array.isArray((p as any)?.brechas_identificadas)
                                ? (p as any).brechas_identificadas.map((desc: string) => ({
                                        level,
                                        title: desc,
                                        description: (p as any)?.observacoes,
                                        excerpt: (p as any)?.trecho,
                                        lawReference: (p as any)?.referencia_legal
                                }))
                                : []
                };
        });

        const [expandedCategories, setExpandedCategories] = useState<string[]>(categories[0] ? [categories[0].id] : []);

        const toggleCategory = (categoryId: string) => {
                setExpandedCategories(prev =>
                        prev.includes(categoryId)
                                ? prev.filter(id => id !== categoryId)
                                : [...prev, categoryId]
                );
        };

	const getLevelColor = (level: "high" | "medium" | "low") => {
		switch (level) {
			case "high": return "text-red bg-red/10 border-red/20";
			case "medium": return "text-orange bg-orange/10 border-orange/20";
			case "low": return "text-green bg-green/10 border-green/20";
		}
	};

        const getSeverityColor = (severity: "high" | "medium" | "low") => {
                switch (severity) {
                        case "high": return "text-red";
                        case "medium": return "text-orange";
                        case "low": return "text-green";
                }
        };

	const getCategoryScoreColor = (score: number) => {
		if (score >= 70) return "text-red";
		if (score >= 40) return "text-orange";
		return "text-green";
	};

	return (
		<div className="space-y-8">
			{/* Risk Factors Overview */}
                        <GlassCard variant="strong" className="p-6">
                                <h3 className="text-xl font-semibold mb-6">Principais Fatores de Risco</h3>
                                {riskFactors && riskFactors.length > 0 ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                                {riskFactors.map((factor, index) => {
                                                        const severity = normalizeLevel(factor.nivel);
                                                        const Icon = getFactorIcon(factor.titulo);
                                                        return (
                                                                <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                                                        <div className={`p-2 rounded-lg ${getSeverityColor(severity)} bg-current/10`}>
                                                                                <Icon className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                                <h4 className="font-medium text-sm">{factor.titulo}</h4>
                                                                                <p className="text-gray-2 text-xs mt-1">{factor.descricao}</p>
                                                                        </div>
                                                                        <Badge className={`${getSeverityColor(severity)} bg-current/10 border-current/20 text-xs`}>
                                                                                {severity === "high" ? "Alto" : severity === "medium" ? "Médio" : "Baixo"}
                                                                        </Badge>
                                                                </div>
                                                        );
                                                })}
                                        </div>
                                ) : (
                                        <p className="text-sm text-gray-2">Nenhum fator de risco identificado.</p>
                                )}
                        </GlassCard>

			{/* Detailed Category Analysis */}
			<div className="space-y-4">
				<h3 className="text-xl font-semibold">Análise por Categoria</h3>

                                {categories.map((category) => {
					const isExpanded = expandedCategories.includes(category.id);

					return (
						<GlassCard key={category.id} variant="default" className="overflow-hidden">
							<button
								onClick={() => toggleCategory(category.id)}
								className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
							>
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										{isExpanded ? (
											<ChevronDown className="w-5 h-5 text-gray-2" />
										) : (
											<ChevronRight className="w-5 h-5 text-gray-2" />
										)}
										<h4 className="text-lg font-medium">{category.title}</h4>
									</div>

									<div className="flex items-center space-x-2">
										<span className={cn("text-sm font-medium", getCategoryScoreColor(category.score))}>
											Score: {category.score}%
										</span>
										{category.issues.length > 0 && (
											<Badge variant="outline" className="text-xs">
												{category.issues.length} issue{category.issues.length > 1 ? 's' : ''}
											</Badge>
										)}
									</div>
								</div>
							</button>

							{isExpanded && (
								<div className="px-6 pb-6 space-y-4 border-t border-white/10">
									{category.issues.map((issue, index) => (
										<div key={index} className="space-y-3 pt-4">
											<div className="flex items-start justify-between">
												<div className="flex items-start space-x-3 flex-1">
													<div className={cn("p-1.5 rounded border", getLevelColor(issue.level))}>
														{issue.level === "high" ? (
															<AlertTriangle className="w-4 h-4" />
														) : issue.level === "medium" ? (
															<Eye className="w-4 h-4" />
														) : (
															<Shield className="w-4 h-4" />
														)}
													</div>

													<div className="flex-1">
														<h5 className="font-medium text-sm">{issue.title}</h5>
														<p className="text-gray-2 text-sm mt-1">{issue.description}</p>
													</div>
												</div>

												<Badge className={cn("text-xs", getLevelColor(issue.level))}>
													{issue.level === "high" ? "Alto" : issue.level === "medium" ? "Médio" : "Baixo"}
												</Badge>
											</div>

                                                                                        {(issue.excerpt || (profileType === "company" && issue.lawReference)) && (
                                                                                                <div className="ml-9 space-y-2">
                                                                                                        {issue.excerpt && (
                                                                                                                <div className="bg-gray-1/5 p-3 rounded border border-gray-1/10">
                                                                                                                        <p className="text-xs italic text-gray-2">"{issue.excerpt}"</p>
                                                                                                                </div>
                                                                                                        )}

                                                                                                        {profileType === "company" && issue.lawReference && (
                                                                                                                <div className="bg-blue/5 p-3 rounded border border-blue/10">
                                                                                                                        <p className="text-xs text-blue">
                                                                                                                                <strong>Base legal:</strong> {issue.lawReference}
                                                                                                                        </p>
                                                                                                                </div>
                                                                                                        )}
                                                                                                </div>
                                                                                        )}
                                                                               </div>
                                                                       ))}
                                                               </div>
                                                       )}
                                               </GlassCard>
                                       );
                               })}
			</div>
		</div>
	);
}