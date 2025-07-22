import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
}

export function ScoreGauge({ score, size = "md", showAnimation = true }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, showAnimation]);

  const getRiskLevel = (score: number) => {
    if (score <= 30) return "low";
    if (score <= 70) return "medium";
    return "high";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "stroke-risk-low";
      case "medium": return "stroke-risk-medium";
      case "high": return "stroke-risk-high";
      default: return "stroke-gray-2";
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case "low": return "Baixo Risco";
      case "medium": return "Risco Medio";
      case "high": return "Alto Risco";
      default: return "Analisando...";
    }
  };

  const sizeClasses = {
    sm: { container: "w-24 h-24", text: "text-sm", score: "text-lg font-bold" },
    md: { container: "w-32 h-32", text: "text-base", score: "text-xl font-bold" },
    lg: { container: "w-48 h-48", text: "text-lg", score: "text-3xl font-bold" }
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const riskLevel = getRiskLevel(score);

  return (
    <div className={cn("relative flex flex-col items-center", sizeClasses[size].container)}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-gray-1 opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", getRiskColor(riskLevel))}
          style={{
            strokeDasharray,
            strokeDashoffset: showAnimation ? strokeDashoffset : circumference - (score / 100) * circumference,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", sizeClasses[size].score)}>
          {Math.round(animatedScore)}
        </span>
        <span className={cn("text-gray-2", sizeClasses[size].text)}>
          {getRiskText(riskLevel)}
        </span>
      </div>
    </div>
  );
}