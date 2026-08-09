import React from 'react';
import { Search, Brain, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const AGENT_STEPS = [
  { id: 'scraping', name: 'Scraper Agent', desc: 'Crawling ENIAD & UMP academic portals...', icon: Search },
  { id: 'analysis', name: 'Analysis Agent', desc: 'Extracting key academic entities...', icon: Brain },
  { id: 'summarizer', name: 'Summarizer Agent', desc: 'Synthesizing response with citations...', icon: FileText },
];

export function AgentProgressVisualizer({ currentStep = 'scraping', isComplete = false }) {
  const getStepStatus = (stepId) => {
    if (isComplete) return 'completed';
    const stepOrder = ['scraping', 'analysis', 'summarizer'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Smart Multi-Agent Workflow Engine
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">ENIAD SMA v2.0</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {AGENT_STEPS.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 ${
                status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : status === 'active'
                  ? 'bg-blue-950/40 border-blue-500/60 text-blue-300 animate-pulse'
                  : 'bg-slate-800/20 border-slate-700/40 text-slate-500'
              }`}
            >
              <div className="mt-0.5">
                {status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : status === 'active' ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 opacity-50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium leading-none mb-1 flex items-center justify-between">
                  <span>{step.name}</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold">
                    {status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight truncate">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgentProgressVisualizer;
