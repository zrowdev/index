'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ArrowUp, 
  Download, 
  Users, 
  Globe, 
  Puzzle, 
  Shield, 
  Layout, 
  HardDrive,
  MessageSquare,
  Bot,
  CheckCircle,
  Terminal,
  Folder,
  Database,
  Zap,
  Brain,
  Map,
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

  const features = [
    {
      title: "Agent Delegation",
      description: "Not one assistant — a team. The main agent distributes tasks across sub-agents: in parallel, in the background, with prioritization.",
      icon: Users
    },
    {
      title: "Multi-Provider",
      description: "Anthropic Claude, OpenRouter, GitHub Copilot — connect any LLM through a unified account interface.",
      icon: Globe
    },
    {
      title: "Plugin Architecture",
      description: "Everything is a plugin: terminal, git, file explorer, MCP servers. Declarative manifests, typed SDK.",
      icon: Puzzle
    },
    {
      title: "Smart Permissions",
      description: "Three-layer security: sandbox broker, command preflight checks, policy engine with approve/deny/ask per tool.",
      icon: Shield
    },
    {
      title: "Familiar Interface",
      description: "VSCode-like layout: sidebars, dock panels, tabs with drag-and-drop. Everything you're used to — but with AI at the core.",
      icon: Layout
    },
    {
      title: "Local & Private",
      description: "Your data stays on your machine. No cloud dependencies for core functionality. File-based storage, no telemetry.",
      icon: HardDrive
    }
  ];

  const steps = [
    {
      title: "Describe the task",
      description: "Write what you need in natural language. Attach files, reference code, provide context.",
      icon: MessageSquare
    },
    {
      title: "Agent takes over",
      description: "The orchestrator assembles context, tools, and prompts. The AI agent writes code, runs commands, reads files.",
      icon: Bot
    },
    {
      title: "Delegation kicks in",
      description: "Complex tasks are distributed across sub-agents — running in parallel, reporting back to the main agent.",
      icon: Users
    },
    {
      title: "Review the result",
      description: "Diffs in the editor, output in the terminal, response in chat. Approve, reject, or iterate.",
      icon: CheckCircle
    }
  ];

  const plugins = [
    { name: "Terminal", icon: Terminal, desc: "Integrated terminal" },
    { name: "Git", icon: GitBranch, desc: "Branches, commits, diffs" },
    { name: "Explorer", icon: Folder, desc: "Project file tree" },
    { name: "MCP", icon: Database, desc: "Model Context Protocol" },
    { name: "Skills", icon: Zap, desc: "Prompt packs & rules" },
    { name: "Memories", icon: Brain, desc: "Knowledge base" },
    { name: "Plan", icon: Map, desc: "Task management" },
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-200 font-sans">
      {/* Header */}
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
              Your Code. <br/>
              Your Agents. <br/>
              <span className="font-mono opacity-40 italic">Your Rules.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl opacity-60 mb-10 leading-relaxed"
            >
              A desktop IDE where AI agents are first-class citizens.
              Local, extensible, private.
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

        {/* Features Grid */}
        <section className="mb-32">
          <h2 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-12">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="border border-black/10 dark:border-white/10 p-6 rounded-lg hover:border-black/30 dark:hover:border-white/30 transition-colors">
                <feature.icon className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="opacity-60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-32">
          <h2 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-12">Workflow</h2>
          <div className="relative border-l border-black/10 dark:border-white/10 ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="mb-12 md:mb-0 ml-8 md:ml-0 relative">
                <span className="absolute -left-[37px] md:hidden w-4 h-4 rounded-full bg-black dark:bg-white border-4 border-white dark:border-black"></span>
                <div className="mb-4 opacity-30 font-mono text-xs">Step 0{i + 1}</div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="opacity-60 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Built-in Plugins */}
        <section className="mb-32">
          <h2 className="text-sm font-mono uppercase tracking-widest opacity-50 mb-12">Built-in Plugins</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {plugins.map((plugin, i) => (
              <div key={i} className="border border-black/10 dark:border-white/10 p-4 rounded-lg flex flex-col items-center text-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <plugin.icon className="w-6 h-6 opacity-60" />
                <span className="font-medium text-sm">{plugin.name}</span>
                <span className="text-[10px] opacity-40 leading-tight">{plugin.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-20 border-t border-black/10 dark:border-white/10">
          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
            AI coding without compromise.
          </h2>
          <p className="text-xl opacity-60 mb-10 max-w-2xl mx-auto">
            Stop switching between your IDE and AI chat. <br/>
            Zrow brings agents directly into your workflow.
          </p>
          <button className="h-12 px-8 bg-black text-white dark:bg-white dark:text-black rounded font-medium hover:opacity-90 transition-opacity">
            Get Early Access
          </button>
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
