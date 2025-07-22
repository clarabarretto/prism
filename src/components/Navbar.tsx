import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onHome: () => void;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
}

export function Navbar({ onHome, onBack, showBack = false, title }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showBack && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-2 hover:text-foreground hover:bg-white/10 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>

          {/* Center */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onHome}
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              Prism
            </button>
            {title && (
              <>
                <span className="text-gray-2">•</span>
                <span className="text-gray-2">{title}</span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="text-gray-2 hover:text-foreground hover:bg-white/10 rounded-xl"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}