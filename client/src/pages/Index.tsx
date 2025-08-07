import { useState } from "react";
import { ProfileSelection } from "@/components/ProfileSelection";
import { CompanyLogin } from "@/components/CompanyLogin";
import { CompanyRegistration, CompanyData } from "@/components/CompanyRegistration";
import { CompanyDashboard } from "@/components/CompanyDashboard";
import { CompanyDocuments } from "@/components/CompanyDocuments";
import { UploadSection } from "@/components/UploadSection";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisResults } from "@/components/AnalysisResults";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { analyzeText, analyzePdf, AnalysisResponse } from "@/services/api";

type AppState = "profile" | "company-login" | "company-registration" | "company-dashboard" | "company-documents" | "upload" | "loading" | "results" | "history";
type ProfileType = "user" | "company";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("profile");
  const [profileType, setProfileType] = useState<ProfileType>("user");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  interface AnalysisData {
    filename?: string;
    result?: AnalysisResponse;
  }
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleProfileSelect = (profile: ProfileType) => {
    setProfileType(profile);
    if (profile === "company") {
      setCurrentState("company-login");
    } else {
      setCurrentState("upload");
    }
  };

  const handleCompanyLogin = (credentials: { email: string; password: string }) => {
    // TODO: Integrate with real authentication API
    setCompanyData({
      name: credentials.email,
      sector: "",
      size: "",
      country: "",
      regulations: []
    });
    setCurrentState("company-dashboard");
  };

  const handleCompanyRegistration = (data: CompanyData) => {
    setCompanyData(data);
    setCurrentState("company-dashboard");
  };

  const handleFileAnalysis = async (file: File) => {
    setCurrentState("loading");
    try {
      let result: AnalysisResponse;
      if (file.type === "application/pdf") {
        result = await analyzePdf(file);
      } else {
        const text = await file.text();
        result = await analyzeText(text);
      }
      setAnalysisData({ filename: file.name, result });
      setCurrentState("results");
    } catch (error) {
      console.error("Analysis failed", error);
      setCurrentState("upload");
    }
  };

  const handleHome = () => {
    setCurrentState("profile");
    setAnalysisData(null);
    setCompanyData(null);
  };

  const handleStartNew = () => {
    setCurrentState("profile");
    setAnalysisData(null);
    setCompanyData(null);
  };

  switch (currentState) {
    case "profile":
      return <ProfileSelection onSelectProfile={handleProfileSelect} onHome={handleHome} />;
    
    case "company-login":
      return (
        <CompanyLogin 
          onLogin={handleCompanyLogin}
          onRegister={() => setCurrentState("company-registration")}
          onBack={() => setCurrentState("profile")}
          onHome={handleHome}
        />
      );
    
    case "company-registration":
      return (
        <CompanyRegistration 
          onComplete={handleCompanyRegistration}
          onBack={() => setCurrentState("company-login")}
          onHome={handleHome}
        />
      );
    
    case "company-dashboard":
      return (
        <CompanyDashboard
          companyData={companyData!}
          onNewAnalysis={() => setCurrentState("upload")}
          onViewAnalysis={() => setCurrentState("history")}
          onManageDocuments={() => setCurrentState("company-documents")}
          onHome={handleHome}
        />
      );

    case "company-documents":
      return (
        <CompanyDocuments
          onBack={() => setCurrentState("company-dashboard")}
          onHome={handleHome}
          onAnalyzeDocument={(docId) => {
            // TODO: Set up analysis for specific document
            setCurrentState("loading");
          }}
        />
      );
    
    case "upload":
      return (
        <UploadSection 
          profileType={profileType} 
          onFileAnalysis={handleFileAnalysis}
          onBack={() => profileType === "company" ? setCurrentState("company-dashboard") : setCurrentState("profile")}
          onHome={handleHome}
        />
      );
    
    case "loading":
      return <LoadingAnalysis onBack={() => setCurrentState("upload")} onHome={handleHome} />;
    
    case "results":
      return (
        <AnalysisResults
          profileType={profileType}
          score={analysisData?.result?.pontuacao_geral ?? 0}
          result={analysisData?.result}
          filename={analysisData?.filename}
          onStartNew={handleStartNew}
          onBack={() => setCurrentState("upload")}
          onHome={handleHome}
        />
      );
    
    case "history":
      return (
        <AnalysisHistory
          profileType={profileType}
          onViewAnalysis={() => setCurrentState("results")}
          onNewAnalysis={() => setCurrentState("upload")}
          onBack={() => profileType === "company" ? setCurrentState("company-dashboard") : setCurrentState("profile")}
          onHome={handleHome}
        />
      );
    
    default:
      return <ProfileSelection onSelectProfile={handleProfileSelect} onHome={handleHome} />;
  }
};

export default Index;
