import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  MessageSquare, 
  Shield, 
  AlertTriangle, 
  FolderOpen, 
  Hospital, 
  FileText, 
  History,
  Download
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "incidents", label: "Incidents", icon: FolderOpen },
  { id: "alerts", label: "Live Alerts", icon: AlertTriangle },
  { id: "evidence", label: "Evidence", icon: Shield },
  { id: "chat", label: "Respond", icon: MessageSquare },
  { id: "services", label: "Services", icon: Hospital },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "history", label: "Case History", icon: History },
  { id: "reports", label: "Reports", icon: Download },
];

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border transition-smooth z-50">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">GBV Responder</h2>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-3 text-left rounded-lg transition-smooth",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeSection === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};