import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

interface UrlInputProps {
        onAnalyze: (url: string) => Promise<void>;
}

export function UrlInput({ onAnalyze }: UrlInputProps) {
        const [url, setUrl] = useState("");
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                if (!url) return;
                setLoading(true);
                try {
                        await onAnalyze(url);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <GlassCard variant="strong" className="p-8 lg:w-1/2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center">
                                        <LinkIcon className="w-12 h-12 mx-auto text-blue mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Analisar por URL</h3>
                                        <p className="text-gray-2">Informe o link da política de privacidade</p>
                                </div>
                                <div className="space-y-4">
                                        <Input
                                                type="url"
                                                placeholder="https://exemplo.com/privacidade"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                required
                                                disabled={loading}
                                        />
                                        <Button type="submit" className="w-full" disabled={loading}>
                                                {loading ? "Analisando..." : "Analisar"}
                                        </Button>
                                </div>
                        </form>
                </GlassCard>
        );
}

