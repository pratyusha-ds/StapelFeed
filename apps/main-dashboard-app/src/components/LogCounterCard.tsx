import React from "react";
import { Activity, RefreshCw } from "lucide-react";
import LogStreamTable from "./LogStreamTable";

function LiveDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
  );
}

function LogCounter({ count, isLoading }: { count?: number; isLoading: boolean }) {
  return (
    <span className="text-4xl font-bold tracking-tight text-white">
      {isLoading ? (
        <span className="text-lg text-slate-500">Loading...</span>
      ) : (
        <>
          {count!.toLocaleString()}
          <span className="text-lg font-normal text-slate-400"> logs processed</span>
        </>
      )}
    </span>
  );
}

interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: string;
  message: string;
}

interface LogCounterCardProps {
  logCount?: number;
  logs: LogEntry[];
  isLoading: boolean;
}

export default function LogCounterCard({ logCount, logs, isLoading }: LogCounterCardProps) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-100">System Log Stream</h2>
        </div>
        <LiveDot />
      </div>

      <div className="mb-6">
        <LogCounter count={logCount} isLoading={isLoading} />
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>

      {logs.length > 0 && <LogStreamTable logs={logs} />}
    </div>
  );
}
