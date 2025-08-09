import { User, Building2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Navbar } from "./Navbar";

interface ProfileSelectionProps {
	onSelectProfile: (profile: "user" | "company") => void;
	onHome: () => void;
}

export function ProfileSelection({ onSelectProfile, onHome }: ProfileSelectionProps) {
	return (
		<>
			<Navbar
				onHome={onHome}
				showBack={false}
			/>

			<div className="min-h-screen bg-gradient-to-br from-gray-3/5 via-background to-gray-1 flex items-center justify-center p-6 pt-24">
				<div className="max-w-4xl w-full space-y-12">
					{/* Header */}
					<div className="text-center space-y-6">
						<h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							Prism
						</h1>
						<p className="text-xl text-gray-2 max-w-2xl mx-auto leading-relaxed">
							Descubra se sua privacidade está em risco em segundos.
							<br />Análise inteligente de políticas de privacidade com IA.
						</p>
					</div>

					{/* Profile Cards */}
					<div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
						{/* User Profile */}
						<GlassCard
							variant="strong"
							interactive
							className="p-8 text-center space-y-6 group"
							onClick={() => onSelectProfile("user")}
						>
							<div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<User className="w-8 h-8 text-white" />
							</div>

							<div className="space-y-3">
								<h3 className="text-2xl font-semibold">Sou Usuário</h3>
								<p className="text-gray-2 leading-relaxed">
									Quero verificar se uma política de privacidade põe meus dados em risco
								</p>
							</div>

							<div className="space-y-2 text-sm text-gray-2">
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-green rounded-full"></div>
									<span>Análise rápida</span>
								</div>
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-green rounded-full"></div>
									<span>Explicação simples</span>
								</div>
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-green rounded-full"></div>
									<span>Score visual</span>
								</div>
							</div>
						</GlassCard>

						{/* Company Profile */}
						<GlassCard
							variant="strong"
							className="p-8 text-center space-y-6 group opacity-50 grayscale"
						>
							<div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full -rotate-12">
								EM BREVE
							</div>
							<div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange to-red rounded-2xl flex items-center justify-center">
								<Building2 className="w-8 h-8 text-white" />
							</div>

							<div className="space-y-3">
								<h3 className="text-2xl font-semibold">Sou Empresa</h3>
								<p className="text-gray-2 leading-relaxed">
									Preciso auditar minha política e melhorar conformidade LGPD/GDPR
								</p>
							</div>

							<div className="space-y-2 text-sm text-gray-2">
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-blue rounded-full"></div>
									<span>Relatório detalhado</span>
								</div>
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-blue rounded-full"></div>
									<span>Plano de ação</span>
								</div>
								<div className="flex items-center justify-center space-x-2">
									<div className="w-2 h-2 bg-blue rounded-full"></div>
									<span>Conformidade legal</span>
								</div>
							</div>
						</GlassCard>
					</div>

					{/* Footer */}
					<div className="text-center">
						<p className="text-gray-2 text-sm">
							Processamento seguro • Sem armazenamento • HTTPS
						</p>
					</div>
				</div>
			</div>
		</>
	);
}