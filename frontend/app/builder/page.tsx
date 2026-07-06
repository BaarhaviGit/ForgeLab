'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchTemplates, runSimulation, injectFailure } from '../../lib/api';
import ConfigPanel from '../../components/ConfigPanel';
import MetricsChart from '../../components/MetricsChart';
import { Play, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  
  const [config, setConfig] = useState<any>(null);
  const [normalMetrics, setNormalMetrics] = useState<any>(null);
  const [failureMetrics, setFailureMetrics] = useState<any>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates().then(templates => {
      const tpl = templates.find((t: any) => t.id === templateId) || templates[0];
      if (tpl) setConfig(tpl.defaultConfig);
      setIsLoading(false);
    }).catch(console.error);
  }, [templateId]);

  const handleRun = async () => {
    try {
      const metrics = await runSimulation(config);
      setNormalMetrics(metrics);
      setFailureMetrics(null);
      setExplanation('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleFailure = async (type: string) => {
    if (!normalMetrics) return;
    try {
      const res = await injectFailure(config, type);
      setFailureMetrics(res.metrics);
      setExplanation(res.explanation);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="p-12 text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-2 text-sm font-semibold">
              <ArrowLeft size={16} /> Back to Templates
            </Link>
            <h1 className="text-3xl font-bold">Simulation Builder</h1>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleRun}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Play size={18} fill="currentColor" />
              Run Simulation
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <ConfigPanel config={config} onChange={setConfig} />

            {normalMetrics && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Inject Failure
                </h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleFailure('db_crash')}
                    className="px-4 py-2 bg-slate-900 hover:bg-red-900/50 border border-slate-700 hover:border-red-500 rounded text-left transition-colors flex items-center gap-3"
                  >
                    <Zap size={16} className="text-red-500" />
                    Database Crash
                  </button>
                  <button 
                    onClick={() => handleFailure('traffic_spike')}
                    className="px-4 py-2 bg-slate-900 hover:bg-yellow-900/50 border border-slate-700 hover:border-yellow-500 rounded text-left transition-colors flex items-center gap-3"
                  >
                    <Zap size={16} className="text-yellow-500" />
                    10x Traffic Spike
                  </button>
                  <button 
                    onClick={() => handleFailure('cache_eviction')}
                    className="px-4 py-2 bg-slate-900 hover:bg-orange-900/50 border border-slate-700 hover:border-orange-500 rounded text-left transition-colors flex items-center gap-3"
                  >
                    <Zap size={16} className="text-orange-500" />
                    Cache Eviction
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            {normalMetrics ? (
              <>
                <MetricsChart normalMetrics={normalMetrics} failureMetrics={failureMetrics} />
                
                {explanation && (
                  <div className="bg-slate-900 border-l-4 border-l-red-500 p-6 rounded-r-2xl shadow-lg">
                    <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle size={18} /> AI Analysis
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {explanation}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard title="Cost / mo" value={`$${failureMetrics?.cost || normalMetrics.cost}`} color="text-green-400" />
                  <MetricCard title="Latency" value={`${failureMetrics?.latency || normalMetrics.latency} ms`} color={failureMetrics ? 'text-red-400' : 'text-blue-400'} />
                  <MetricCard title="Throughput" value={`${failureMetrics?.throughput || normalMetrics.throughput} req/s`} color="text-slate-200" />
                  <MetricCard title="Availability" value={`${failureMetrics?.availability || normalMetrics.availability}%`} color={failureMetrics ? 'text-orange-400' : 'text-slate-200'} />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-12 text-slate-500">
                Configure your architecture and click "Run Simulation" to see metrics.
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

function MetricCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
      <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
