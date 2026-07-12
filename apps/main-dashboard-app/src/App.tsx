import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Rss } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import LogCounterCard from "./components/LogCounterCard";

const SERVICES = [
  "auth-service",
  "payment-gateway",
  "api-router",
  "user-sync",
  "notification-queue",
];
const LEVELS = ["INFO", "WARN", "ERROR"] as const;
const MESSAGES: Record<string, string[]> = {
  "auth-service": [
    "Token refreshed",
    "Invalid session",
    "User authenticated",
    "Rate limit hit",
  ],
  "payment-gateway": [
    "Charge succeeded",
    "Payment declined",
    "Refund processed",
    "Webhook received",
  ],
  "api-router": [
    "Request proxied",
    "Response 502 upstream",
    "Cache miss",
    "Route matched",
  ],
  "user-sync": [
    "Profile updated",
    "Sync completed",
    "Conflict detected",
    "Batch processed",
  ],
  "notification-queue": [
    "Email queued",
    "Push sent",
    "Queue drained",
    "Delivery failed",
  ],
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
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: () =>
      Promise.resolve({
        totalProcessed: 1432 + Math.floor(Math.random() * 10),
        logs: generateLogs(),
      }),
    refetchInterval: 3000,
  });

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/logs/stream");

    eventSource.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      queryClient.setQueryData(["systemLogs"], (oldData: any) =>
        oldData
          ? { ...oldData, logs: [newLog, ...(oldData.logs ?? [])] }
          : { logs: [newLog] },
      );
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <DashboardHeader
          left={
            <LogCounterCard
              logCount={data?.totalProcessed}
              logs={data?.logs ?? []}
              isLoading={isLoading}
            />
          }
          right={<ContentColumn />}
        />
      </div>
    </div>
  );
}
