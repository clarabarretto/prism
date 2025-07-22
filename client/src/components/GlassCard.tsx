import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
	children: ReactNode;
	className?: string;
	variant?: "default" | "strong";
	interactive?: boolean;
	onClick?: () => void;
}

export function GlassCard({
	children,
	className,
	variant = "default",
	interactive = false,
	onClick
}: GlassCardProps) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-white/20 backdrop-blur-xl",
				variant === "default" && "bg-white/10",
				variant === "strong" && "bg-white/20 border-white/30",
				interactive && "interactive hover-glow cursor-pointer",
				className
			)}
			style={{
				boxShadow: variant === "strong"
					? "0 12px 40px 0 hsl(0 0% 0% / 0.15)"
					: "0 8px 32px 0 hsl(0 0% 0% / 0.1)"
			}}
			onClick={onClick}
		>
			{children}
		</div>
	);
}
