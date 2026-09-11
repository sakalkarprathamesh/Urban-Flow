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
      actionText: "View Command Dashboard",
      icon: Layers,
      action: () => {
        onNavigateTab("dashboard");
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
      title: "3. Optimize & Consolidate Network",
      subtitle: "Multi-Source Clustering & Micro-Hub Allocation",
      script: "“When we click Optimize Network, Urban Flow clusters compatible shipments by geographical proximity and assigns them to the optimal micro-hub.”",
      actionText: "Execute Network Optimization",
      icon: Sparkles,
      action: () => {
        onNavigateTab("deliveries");
        onTriggerOptimize();
      }
    },
    {
      title: "4. Simulate Road Closure & Dynamic Reroute",
      subtitle: "Urban Resiliency in Changing Conditions",
      script: "“Watch what happens when an incident closes Fergusson College Road. The system recalculates the route in real-time, displays the detour, and updates the ETA from 28 to 32.5 minutes.”",
      actionText: "Simulate FC Road Closure",
      icon: AlertTriangle,
      action: () => {
        onNavigateTab("map");
        onTriggerRoadClosure();
      }
    },
    {
      title: "5. Reverse Logistics Piggybacking",
      subtitle: "Eliminating Empty Return Journeys",
      script: "“Instead of delivery vehicles returning empty to the hub, Urban Flow automatically pairs them with eligible package returns and merchant pickups in the destination corridor.”",
      actionText: "Run Reverse Matcher",
      icon: RotateCcw,
      action: () => {
        onNavigateTab("reverse");
        onTriggerReverseMatch();
      }
    },
    {
      title: "6. Simulation Center: Before vs After",
      subtitle: "Quantifiable Impact: Trips, Kilometers & Carbon Avoided",
      script: "“Here is our comparative model. Under the same package demand, Urban Flow reduces vehicle trips by 38%, cuts total vehicle kilometers by 36%, and elevates vehicle capacity utilization from 48% to 72%.”",
      actionText: "Open Simulation Center",
      icon: Sliders,
      action: () => {
        onNavigateTab("simulation");
      }
    },
    {
      title: "7. AI Intelligence Layer Explanation",
      subtitle: "AI Explains Rather Than Invents Data",
      script: "“Finally, ask the AI assistant: 'Where should we build the next micro-hub and why?' The AI analyzes live database utilization and provides an evidence-based recommendation.”",
      actionText: "Launch AI Assistant",
      icon: Bot,
      action: () => {
        onOpenAi();
      }
    }
  ];

  if (!isOpen) return null;

  const activeStepData = steps[currentStep];
  const StepIcon = activeStepData.icon;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Faculty Demonstration Walkthrough</h2>
              <p className="text-[11px] text-slate-400">Step-by-step presentation script & action triggers (Section 30)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 gap-1.5 overflow-x-auto">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                currentStep === idx
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : currentStep > idx
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {currentStep > idx ? <CheckCircle2 className="w-3 h-3" /> : <span>{idx + 1}</span>}
              <span className="hidden sm:inline">{s.title.split('.')[1]}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h3 className="text-base font-bold text-white">{activeStepData.title}</h3>
              <p className="text-xs text-slate-400">{activeStepData.subtitle}</p>
            </div>
          </div>

          {/* Presentation Script Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm italic leading-relaxed">
            <span className="font-sans not-italic text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Recommended Presentation Script:
            </span>
            {activeStepData.script}
          </div>

          {/* Action Button for this step */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={activeStepData.action}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              {activeStepData.actionText}
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-30"
              >
                Next Step
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
