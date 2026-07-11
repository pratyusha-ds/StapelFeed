import React from "react";
import { RefreshCw, Activity, Rss } from "lucide-react";

function LogCounter() {
  return (
    <span className="text-4xl font-bold tracking-tight text-white">
      1,432
      <span className="text-lg font-normal text-slate-400"> logs processed</span>
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
  );
}

function InfrastructureCard() {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-100">
            System Log Stream
          </h2>
        </div>
        <LiveDot />
      </div>

      <div className="mb-6">
        <LogCounter />
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );
}

function FeedPlaceholderCard() {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Rss className="h-5 w-5 text-orange-400" />
        <span className="text-sm text-slate-400">
          Feed collection initialization pending backend connection...
        </span>
      </div>
    </div>
  );
}

function ContentColumn() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-100">
        StapelFeed — Developer Stream
      </h2>
      <FeedPlaceholderCard />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <InfrastructureCard />
          <ContentColumn />
        </div>
      </div>
    </div>
  );
}
