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
import { DemoMode } from "@/components/DemoMode";
import PrivacyAnalysisService from "@/services/PrivacyAnalysisService";

type AppState = "profile" | "company-login" | "company-registration" | "company-dashboard" | "company-documents" | "upload" | "demo" | "loading" | "results" | "history";
type ProfileType = "user" | "company";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("profile");
  const [profileType, setProfileType] = useState<ProfileType>("user");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Mock score generation based on analysis data
  const generateMockScore = () => {
    if (!analysisData) return 50;
    
    // Simple mock logic for demo
    if (analysisData.content?.includes("instagram") || analysisData.content?.includes("facebook")) {
      return Math.floor(Math.random() * 20) + 75; // High risk for social media
    }
    
    if (analysisData.type === "url" && analysisData.content?.includes("gov")) {
      return Math.floor(Math.random() * 30) + 10; // Low risk for government sites
    }
    
    return Math.floor(Math.random() * 60) + 30; // Medium risk for others
  };

  const handleProfileSelect = (profile: ProfileType) => {
    setProfileType(profile);
    if (profile === "company") {
      setCurrentState("company-login");
    } else {
      setCurrentState("upload");
    }
  };

  const handleCompanyLogin = (credentials: { email: string; password: string }) => {
    // TODO: Replace with actual API call
    console.log("Login attempt:", credentials);
    
    // Mock successful login
    const mockCompanyData: CompanyData = {
      name: "Empresa Demo Ltda",
      sector: "tecnologia",
      size: "media",
      country: "BR",
      regulations: ["lgpd", "gdpr"]
    };
    
    setCompanyData(mockCompanyData);
    setCurrentState("company-dashboard");
  };

  const handleCompanyRegistration = (data: CompanyData) => {
    setCompanyData(data);
    setCurrentState("company-dashboard");
  };

  const handleFileAnalysis = (data: { type: "file", content: string, filename?: string }) => {
    setAnalysisData(data);
    setCurrentState("loading");
  };

  const handleAnalysisComplete = () => {
    setCurrentState("results");
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
    
    case "demo":
      return (
        <DemoMode
          onSelectDemo={handleFileAnalysis}
          onBack={() => setCurrentState("upload")}
          onHome={handleHome}
        />
      );
    
    case "loading":
      return <LoadingAnalysis onComplete={handleAnalysisComplete} onBack={() => setCurrentState("upload")} onHome={handleHome} />;
    
    case "results":
      return (
        <AnalysisResults
          profileType={profileType}
          score={generateMockScore()}
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
