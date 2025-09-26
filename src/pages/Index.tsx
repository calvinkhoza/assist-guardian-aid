import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { IncidentTable } from "@/components/IncidentTable";
import { AlertModal } from "@/components/AlertModal";
import { ChatSection } from "@/components/ChatSection";
import { EvidenceSection } from "@/components/EvidenceSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { HistorySection } from "@/components/HistorySection";
import { ReportsSection } from "@/components/ReportsSection";
import { LiveAlertsSection } from "@/components/LiveAlertsSection";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface Incident {
  id: string;
  date: string;
  type: string;
  location: string;
  priority: 'critical' | 'urgent' | 'follow-up';
  status: 'new' | 'in-progress' | 'resolved';
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAlert, setShowAlert] = useState(false);
  const [language, setLanguage] = useState("en");
  const { toast } = useToast();

  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Load incidents from localStorage
    const savedIncidents = localStorage.getItem('gbv-incidents');
    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    } else {
      // Initial sample data
      const initialIncidents: Incident[] = [
        { id: 'GBV-2023-0012', date: '2023-10-15', type: 'Physical', location: 'Johannesburg, GP', priority: 'critical', status: 'new' },
        { id: 'GBV-2023-0011', date: '2023-10-14', type: 'Sexual', location: 'Cape Town, WC', priority: 'urgent', status: 'in-progress' },
        { id: 'GBV-2023-0010', date: '2023-10-13', type: 'Emotional', location: 'Durban, KZN', priority: 'follow-up', status: 'resolved' },
        { id: 'GBV-2023-0009', date: '2023-10-12', type: 'Financial', location: 'Pretoria, GP', priority: 'urgent', status: 'new' },
        { id: 'GBV-2023-0008', date: '2023-10-11', type: 'Physical', location: 'Port Elizabeth, EC', priority: 'critical', status: 'in-progress' },
        { id: 'GBV-2023-0007', date: '2023-10-10', type: 'Sexual', location: 'Bloemfontein, FS', priority: 'follow-up', status: 'resolved' }
      ];
      setIncidents(initialIncidents);
      localStorage.setItem('gbv-incidents', JSON.stringify(initialIncidents));
    }
  }, []);

  const updateIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents);
    localStorage.setItem('gbv-incidents', JSON.stringify(newIncidents));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardStats incidents={incidents} />
            <div className="bg-card rounded-lg shadow-custom p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Incidents</h2>
                <Button variant="default" onClick={() => setActiveSection("incidents")}>
                  View All
                </Button>
              </div>
              <IncidentTable incidents={incidents.slice(0, 5)} updateIncidents={updateIncidents} />
            </div>
          </div>
        );
      case "incidents":
        return (
          <div className="bg-card rounded-lg shadow-custom p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Incident Management</h2>
              <Button variant="default">Add New Incident</Button>
            </div>
            <IncidentTable incidents={incidents} updateIncidents={updateIncidents} showFilters />
          </div>
        );
      case "alerts":
        return <LiveAlertsSection onShowAlert={() => setShowAlert(true)} />;
      case "evidence":
        return <EvidenceSection />;
      case "chat":
        return <ChatSection />;
      case "services":
        return <ServicesSection />;
      case "analytics":
        return <AnalyticsSection incidents={incidents} />;
      case "history":
        return <HistorySection />;
      case "reports":
        return <ReportsSection />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 ml-64 transition-smooth">
        <header className="bg-card shadow-custom border-b border-border p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">GBV Responder Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zu">isiZulu</SelectItem>
                  <SelectItem value="xh">isiXhosa</SelectItem>
                  <SelectItem value="af">Afrikaans</SelectItem>
                  <SelectItem value="st">Sesotho</SelectItem>
                  <SelectItem value="tn">Setswana</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                RS
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderActiveSection()}
        </main>
      </div>

      <AlertModal open={showAlert} onOpenChange={setShowAlert} />
    </div>
  );
};

export default Index;