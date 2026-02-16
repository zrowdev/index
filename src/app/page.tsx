'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ArrowUp, 
  Download, 
  Cpu, 
  Layers, 
  GitCommit, 
  Github,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = [
  "Analyzing context...",
  "Exploring possibilities...",
  "Formulating response..."
];

export default function Home() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePush = () => {
    setIsPushing(true);
    setTimeout(() => setIsPushing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-200 font-sans">
      {/* Git Branch Header Mockup */}
      <header className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-sm">
            <GitBranch className="w-4 h-4" />
            <span className="opacity-60">zrow /</span>
            <span className="font-medium">main</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[10px] uppercase tracking-widest font-mono opacity-50">System Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 border border-black/10 dark:border-white/20 rounded flex items-center gap-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all">
            <Github className="w-4 h-4" />
            <span>Star</span>
          </button>
          <button 
            onClick={handlePush}
            className="h-8 min-w-[80px] px-3 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black rounded flex items-center justify-center gap-2 text-sm hover:opacity-80 transition-all"
          >
            {isPushing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
            <span>Push</span>
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <section className="mb-32">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-semibold tracking-tight mb-6"
            >
              Zrow: The Intent-Driven <br/>
              <span className="font-mono opacity-40 italic">AI Orchestrator.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl opacity-60 mb-10 leading-relaxed"
            >
              No fluff. High-load ready. <br/>
              Distributed by design for engineering excellence.
            </motion.p>
            
            <div className="flex flex-col gap-6">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group w-fit h-14 px-8 border-2 border-black dark:border-white flex items-center gap-4 text-lg font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-lg dark:hover:shadow-white/5"
              >
                <span>Download for macOS</span>
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
              
              <div className="flex items-center gap-3 font-mono text-sm opacity-40 min-h-[20px]">
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={statusIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.5 }}
                  >
                    {statuses[statusIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          {/* Distributed Execution */}
          <div className="border border-black/10 dark:border-white/10 p-8 rounded-lg flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6" />
              <h3 className="text-xl font-medium uppercase tracking-tight">Distributed Execution</h3>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded font-mono text-xs overflow-hidden leading-relaxed">
              <div className="flex gap-2 mb-1">
                <span className="opacity-30">10:24:01</span>
                <span className="text-green-500">INFO</span>
                <span className="opacity-70">Agent connected to remote worktree:</span>
              </div>
              <div className="flex gap-2 mb-1 pl-4">
                <span className="opacity-30">10:24:01</span>
                <span className="opacity-90 underline">node-ae21.zrow.io</span>
              </div>
              <div className="flex gap-2 mb-1">
                <span className="opacity-30">10:24:02</span>
                <span className="text-blue-500">SYNC</span>
                <span className="opacity-70">Context window aligned. (4096 tokens)</span>
              </div>
              <div className="flex gap-2 animate-pulse">
                <span className="opacity-30">10:24:03</span>
                <span className="opacity-40">_</span>
              </div>
            </div>
            <p className="opacity-60 text-sm leading-relaxed">
              Scale your intent across multiple environments. Zrow handles the heavy lifting of context synchronization and remote tool execution.
            </p>
          </div>

          {/* Unified Tools & Git Integrated */}
          <div className="grid grid-rows-2 gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium uppercase tracking-tight flex items-center gap-3">
                <Layers className="w-6 h-6" />
                Unified Providers
              </h3>
              <div className="grid grid-cols-3 gap-4 py-4">
                {[
                  { name: 'OpenAI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
                  { name: 'Anthropic', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Anthropic_logo.svg' },
                  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Cloud_Logo.svg' }
                ].map((provider) => (
                  <div key={provider.name} className="h-16 border border-black/10 dark:border-white/10 flex items-center justify-center group hover:border-black dark:hover:border-white transition-colors">
                    <img 
                      src={provider.url} 
                      alt={provider.name} 
                      className="h-6 opacity-60 group-hover:opacity-100 transition-opacity brightness-0 dark:invert"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium uppercase tracking-tight flex items-center gap-3">
                <GitCommit className="w-6 h-6" />
                Git-Integrated
              </h3>
              <p className="opacity-60 text-sm leading-relaxed">
                Deep worktree management. Zrow understands your branches, commits, and diffs, making AI-driven development feel native to your flow.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] py-12 px-6">
        <div className="max-w-screen-xl mx-auto font-mono text-xs flex flex-col gap-4">
          <div className="flex items-center gap-4 opacity-40">
            <span>$ git log --oneline -n 3</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { hash: 'a1b2c3d', msg: 'feat: implement distributed context sync' },
              { hash: 'e5f6g7h', msg: 'fix: race condition in provider switching' },
              { hash: 'i9j0k1l', msg: 'docs: update architectural overview' }
            ].map((log) => (
              <div key={log.hash} className="flex gap-4">
                <span className="text-yellow-600 dark:text-yellow-500">{log.hash}</span>
                <span className="opacity-60">{log.msg}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center opacity-40">
            <span>&copy; 2026 Zrow Systems Inc.</span>
            <span className="flex items-center gap-2">
              v0.4.2-alpha
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
