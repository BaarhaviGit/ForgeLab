'use client';

import { useState } from 'react';

export default function ConfigPanel({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  if (!config) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Configuration</h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Traffic Load (req/sec): <span className="text-white">{config.trafficLoad}</span>
        </label>
        <input 
          type="range" 
          min="10" max="5000" step="10"
          value={config.trafficLoad}
          onChange={e => onChange({ ...config, trafficLoad: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Components</h3>
        {config.components.map((comp: any, idx: number) => (
          <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-3">
            <h4 className="font-semibold text-blue-400 capitalize">{comp.type}</h4>
            
            {comp.config.replicas !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Replicas</span>
                <input 
                  type="number" 
                  min="0" max="20"
                  value={comp.config.replicas}
                  onChange={e => {
                    const newComps = [...config.components];
                    newComps[idx].config.replicas = parseInt(e.target.value) || 0;
                    onChange({ ...config, components: newComps });
                  }}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-right"
                />
              </div>
            )}
            
            {comp.config.cpu !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">CPU (Cores)</span>
                <input 
                  type="number" 
                  min="1" max="64"
                  value={comp.config.cpu}
                  onChange={e => {
                    const newComps = [...config.components];
                    newComps[idx].config.cpu = parseInt(e.target.value) || 1;
                    onChange({ ...config, components: newComps });
                  }}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-right"
                />
              </div>
            )}

            {comp.config.ram !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">RAM (GB)</span>
                <input 
                  type="number" 
                  min="1" max="128"
                  value={comp.config.ram}
                  onChange={e => {
                    const newComps = [...config.components];
                    newComps[idx].config.ram = parseInt(e.target.value) || 1;
                    onChange({ ...config, components: newComps });
                  }}
                  className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-right"
                />
              </div>
            )}

            {comp.config.cacheEnabled !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Enable Cache</span>
                <input 
                  type="checkbox"
                  checked={comp.config.cacheEnabled}
                  onChange={e => {
                    const newComps = [...config.components];
                    newComps[idx].config.cacheEnabled = e.target.checked;
                    onChange({ ...config, components: newComps });
                  }}
                  className="w-4 h-4 accent-blue-500 rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
