'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTemplates } from '../lib/api';

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ForgeLab
          </h1>
          <p className="text-xl text-slate-400">
            Engineering Simulation Sandbox
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Select a Starting Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(tpl => (
              <Link 
                href={`/builder?templateId=${tpl.id}`} 
                key={tpl.id}
                className="block p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors group cursor-pointer"
              >
                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{tpl.name}</h3>
                <p className="text-slate-400 mt-2 text-sm">{tpl.description}</p>
                <div className="mt-6 flex justify-end">
                  <span className="text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Select &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {templates.length === 0 && (
            <div className="text-center text-slate-500 py-12">
              Loading templates... Make sure backend is running.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
