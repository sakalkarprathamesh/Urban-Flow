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
    <div className="fixed inset-0 z-[1200] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#dadce0] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[#e8eaed] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fef7e0] flex items-center justify-center text-[#b06000]">
              <Sparkles className="w-4 h-4 text-[#f29900]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#202124]">Faculty Demonstration Walkthrough</h2>
              <p className="text-xs text-[#5f6368]">Step-by-step presentation script & action sequence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center px-6 py-3 bg-[#f8fafd] border-b border-[#e8eaed] gap-1.5 overflow-x-auto">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                currentStep === idx
                  ? "bg-[#1a73e8] text-white shadow-xs"
                  : currentStep > idx
                  ? "bg-[#e6f4ea] text-[#137333]"
                  : "bg-[#f1f3f4] text-[#5f6368]"
              }`}
            >
              {currentStep > idx ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{idx + 1}</span>}
              <span className="hidden sm:inline">{s.title.split('.')[1]}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1a73e8] uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h3 className="text-base font-bold text-[#202124]">{activeStepData.title}</h3>
              <p className="text-xs text-[#5f6368]">{activeStepData.subtitle}</p>
            </div>
          </div>

          {/* Presentation Script Box */}
          <div className="p-4 rounded-2xl bg-[#f8fafd] border border-[#e8eaed] text-[#3c4043] text-xs leading-relaxed italic">
            <span className="font-sans not-italic text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider block mb-1">
              Recommended Presentation Script:
            </span>
            {activeStepData.script}
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={activeStepData.action}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{activeStepData.actionText}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-full border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] text-xs font-medium disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] text-xs font-medium disabled:opacity-30"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
