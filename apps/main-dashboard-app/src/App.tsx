import React from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Activity, Rss, Clock } from "lucide-react";

const SERVICES = ["auth-service", "payment-gateway", "api-router", "user-sync", "notification-queue"];
const LEVELS = ["INFO", "WARN", "ERROR"] as const;
const MESSAGES: Record<string, string[]> = {
  "auth-service": ["Token refreshed", "Invalid session", "User authenticated", "Rate limit hit"],
  "payment-gateway": ["Charge succeeded", "Payment declined", "Refund processed", "Webhook received"],
  "api-router": ["Request proxied", "Response 502 upstream", "Cache miss", "Route matched"],
  "user-sync": ["Profile updated", "Sync completed", "Conflict detected", "Batch processed"],
  "notification-queue": ["Email queued", "Push sent", "Queue drained", "Delivery failed"],
};

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLogs() {
  const count = randomInt(3, 5);
  return Array.from({ length: count }, (_, i) => {
    const service = randomItem(SERVICES);
    const level = randomItem(LEVELS);
    return {
      id: `${Date.now()}-${i}`,
      timestamp: new Date().toLocaleTimeString(),
      service,
      level,
      message: randomItem(MESSAGES[service]),
    };
  });
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

function LiveDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
  );
}

function InfrastructureCard({ logCount, logs, isLoading }: { logCount?: number; logs: Array<{ id: string; timestamp: string; service: string; level: string; message: string }>; isLoading: boolean }) {
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
        <LogCounter count={logCount} isLoading={isLoading} />
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>

      {logs && logs.length > 0 && <LogStreamTable logs={logs} />}
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

function LogLevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    INFO: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    WARN: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    ERROR: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[level] || styles.INFO}`}>
      {level}
    </span>
  );
}

function LogStreamTable({ logs }: { logs: Array<{ id: string; timestamp: string; service: string; level: string; message: string }> }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Timestamp
                </span>
              </th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">{log.service}</td>
                <td className="px-4 py-2.5"><LogLevelBadge level={log.level} /></td>
                <td className="px-4 py-2.5 text-slate-400">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: () =>
      Promise.resolve({
        totalProcessed: 1432 + Math.floor(Math.random() * 10),
        logs: generateLogs(),
      }),
    refetchInterval: 3000,
  });

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <InfrastructureCard logCount={data?.totalProcessed} logs={data?.logs ?? []} isLoading={isLoading} />
          <ContentColumn />
        </div>
      </div>
    </div>
  );
}
