import React from "react";
import { Clock } from "lucide-react";

function LogLevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    INFO: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    WARN: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    ERROR: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[level] || styles.INFO}`}
    >
      {level}
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

interface LogStreamTableProps {
  logs: LogEntry[];
}

export default function LogStreamTable({ logs }: LogStreamTableProps) {
  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <th className="hidden md:table-cell px-4 py-3 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Timestamp
                </span>
              </th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="hidden md:table-cell px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
              >
                <td className="hidden md:table-cell px-4 py-2.5 font-mono text-xs text-slate-400 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">{log.service}</td>
                <td className="px-4 py-2.5">
                  <LogLevelBadge level={log.level} />
                </td>
                <td className="hidden md:table-cell px-4 py-2.5 text-slate-400 truncate max-w-[200px]">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
