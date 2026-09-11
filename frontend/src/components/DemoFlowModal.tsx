"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  X, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  Bot,
  Play
} from "lucide-react";

interface DemoProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onTriggerOptimize: () => void;
  onTriggerRoadClosure: () => void;
  onTriggerReverseMatch: () => void;
  onOpenAi: () => void;
}

export default function DemoFlowModal({
  isOpen,
  onClose,
  onNavigateTab,
  onTriggerOptimize,
  onTriggerRoadClosure,
  onTriggerReverseMatch,
  onOpenAi
}: DemoProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. City Status Overview",
      subtitle: "The Master Vision: A Second Road Network for Goods",
      script: "“Cities have an advanced road network for people. But there is another parallel road network operating on those same roads — the movement of goods. Modern cities suffer because individual businesses dispatch delivery vehicles independently.”",
      actionText: "Open Overview Dashboard",
      icon: Layers,
      action: () => {
        onNavigateTab("overview");
      }
    },
    {
      title: "2. Explore Pune Logistics Map",
      subtitle: "Fragmented Deliveries Across Neighborhoods",
      script: "“Notice how multiple vehicles from different retail, grocery, and pharmacy businesses are travelling to the same neighborhoods in Kothrud, Hinjewadi, and Viman Nagar with partially filled loads.”",
      actionText: "Open Interactive Live Map",
      icon: MapPin,
      action: () => {
        onNavigateTab("map");
      }
    },
    {
      title: "3. Cluster Consolidation Engine",
      subtitle: "Group Deliveries & Assign to Micro-Hubs",
      script: "“Watch what happens when Urban Flow's clustering engine analyzes destination clusters. Packages are grouped and routed to the nearest micro-hub facility, replacing dozens of isolated direct trips with organized consolidated runs.”",
      actionText: "Trigger Cluster Optimization",
      icon: Sparkles,
      action: () => {
        onNavigateTab("deliveries");
        onTriggerOptimize();
      }
    },
    {
      title: "4. Dynamic Road Closure Rerouting",
      subtitle: "Autonomous Incident Response on FC Road",
      script: "“Let's introduce real-world Pune traffic friction. When Fergusson College Road (FC Road) experiences an incident, Urban Flow instantly recalculates the corridor via Senapati Bapat Road with an ETA change from 28 to 32.5 minutes.”",
      actionText: "Simulate FC Road Incident",
      icon: AlertTriangle,
      action: () => {
        onNavigateTab("overview");
        onTriggerRoadClosure();
      }
    },
    {
      title: "5. Reverse Logistics Matching",
      subtitle: "Don't Let Vehicles Return Empty",
      script: "“One of Urban Flow's most crucial ideas: once vehicles finish drops, they are assigned customer returns along their return path. We've matched pending returns along the Kothrud and Deccan corridors.”",
      actionText: "Run Reverse Corridor Matcher",
      icon: RotateCcw,
      action: () => {
        onNavigateTab("reverse");
        onTriggerReverseMatch();
      }
    },
    {
      title: "6. Simulation & Model Comparison",
      subtitle: "Conventional Model vs Urban Flow",
      script: "“Here is our comparative simulation: by coordinating deliveries through 8 micro-hubs, total vehicle trips drop by 38%, fleet distance drops by 42%, and vehicle utilization climbs from 41% to 74%.”",
      actionText: "Open Simulation Workspace",
      icon: Sliders,
      action: () => {
        onNavigateTab("simulation");
      }
    },
    {
      title: "7. Grounded Logistics AI Analyst",
      subtitle: "Database-Grounded Intelligent Queries",
      script: "“Finally, administrators can query our intelligence layer. Notice how every answer is grounded in live database state—explaining why Hub 04 was chosen or where the city should commission the next facility.”",
      actionText: "Open AI Intelligence Interface",
      icon: Bot,
      action: () => {
        onOpenAi();
      }
    }
  ];

  if (!isOpen) return null;

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-2xl bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#eff6ff] text-[#1e40af]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#0f172a]">
                Faculty Presentation Walkthrough Guide
              </h2>
              <span className="text-[11px] text-[#64748b]">
                Step {currentStep + 1} of {steps.length} • Section 30 Presentation Flow
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#94a3b8] hover:text-[#0f172a] rounded-lg hover:bg-[#f8f9fa] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentStep
                  ? "bg-[#1e3a8a]"
                  : idx < currentStep
                  ? "bg-[#10b981]"
                  : "bg-[#e2e8f0]"
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <div className="p-5 rounded-xl bg-[#f8f9fa] border border-[#e2e8f0] space-y-3">
          <div className="flex items-center gap-2">
            <StepIcon className="w-5 h-5 text-[#1e3a8a]" />
            <h3 className="text-base font-bold text-[#0f172a]">
              {current.title}
            </h3>
          </div>

          <div className="text-xs font-semibold text-[#1e40af] uppercase tracking-wider">
            {current.subtitle}
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-[#e2e8f0] text-xs text-[#334155] leading-relaxed italic">
            {current.script}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3.5 py-2 text-xs font-medium text-[#64748b] hover:text-[#0f172a] disabled:opacity-30 transition-colors"
          >
            Previous Step
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                current.action();
                onClose();
              }}
              className="uf-btn-primary text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{current.actionText}</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="uf-btn-secondary text-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="uf-btn-secondary text-xs"
              >
                <span>Finish Guide</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
