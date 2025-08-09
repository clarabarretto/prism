import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Shield, Eye } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Principle } from "@/services/api";

interface DetailedAnalysisProps {
        profileType: "user" | "company";
        principles?: Record<string, Principle>;
}

const normalizeLevel = (level?: string | number): "high" | "medium" | "low" => {
	// Lower score is higher risk
        if (typeof level === "number") {
		if (level < 4) return "high";
		if (level < 7) return "medium";
                return "low";
        }
        const l = level?.toString().toLowerCase();
        if (l === "alto" || l === "high") return "high";
        if (l === "medio" || l === "médio" || l === "medium") return "medium";
        if (l === "baixo" || l === "low") return "low";
        const num = Number(l);
        if (!isNaN(num)) {
		if (num < 4) return "high";
		if (num < 7) return "medium";
                return "low";
        }
	// Default to low risk if input is weird
        return "low";
};

export function DetailedAnalysis({ profileType, principles }: DetailedAnalysisProps) {
        const categories = Object.entries(principles || {}).map(([key, p]) => {
                const level = normalizeLevel((p as any)?.pontuacao);
                return {
                        id: key,
                        title: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                        score: typeof (p as any)?.pontuacao === "number" ? (p as any).pontuacao * 10 : 0,
                        problemas: Array.isArray((p as any)?.brechas_identificadas)
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

        const getCategoryScoreColor = (score: number) => {
                // Lower score is higher risk, so red color
                if (score < 40) return "text-red";
                if (score < 70) return "text-orange";
                // Higher score is lower risk, so green color
                return "text-green";
        };

	return (
		<div className="space-y-8">
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
                                                                                {category.problemas.length > 0 && (
                                                                                        <Badge variant="outline" className="text-xs">
                                                                                                {category.problemas.length} problema{category.problemas.length > 1 ? 's' : ''}
                                                                                        </Badge>
                                                                                )}
									</div>
								</div>
							</button>

							{isExpanded && (
								<div className="px-6 pb-6 space-y-4 border-t border-white/10">
                                                                        {category.problemas.map((problema, index) => (
										<div key={index} className="space-y-3 pt-4">
											<div className="flex items-start justify-between">
                                                                                                  <div className="flex items-start space-x-3 flex-1">
                                                                                                        <div className={cn("p-1.5 rounded border", getLevelColor(problema.level))}>
                                                                                                                {problema.level === "high" ? (
                                                                                                                        <AlertTriangle className="w-4 h-4" />
                                                                                                                ) : problema.level === "medium" ? (
                                                                                                                        <Eye className="w-4 h-4" />
                                                                                                                ) : (
                                                                                                                        <Shield className="w-4 h-4" />
                                                                                                                )}
                                                                                                        </div>

                                                                                                        <div className="flex-1">
                                                                                                                <h5 className="font-medium text-sm">{problema.title}</h5>
                                                                                                                <p className="text-gray-2 text-sm mt-1">{problema.description}</p>
                                                                                                        </div>
												</div>

                                                                                                  <Badge className={cn("text-xs", getLevelColor(problema.level))}>
                                                                                                        {problema.level === "high" ? "Alto" : problema.level === "medium" ? "Médio" : "Baixo"}
                                                                                                  </Badge>
											</div>

                                                                                        {(problema.excerpt || (profileType === "company" && problema.lawReference)) && (
                                                                                                <div className="ml-9 space-y-2">
                                                                                                        {problema.excerpt && (
                                                                                                                <div className="bg-gray-1/5 p-3 rounded border border-gray-1/10">
                                                                                                                        <p className="text-xs italic text-gray-2">"{problema.excerpt}"</p>
                                                                                                                </div>
                                                                                                        )}

                                                                                                        {profileType === "company" && problema.lawReference && (
                                                                                                                <div className="bg-blue/5 p-3 rounded border border-blue/10">
                                                                                                                        <p className="text-xs text-blue">
                                                                                                                                <strong>Base legal:</strong> {problema.lawReference}
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