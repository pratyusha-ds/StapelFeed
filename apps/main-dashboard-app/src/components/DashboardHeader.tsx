import React from "react";

interface DashboardHeaderProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function DashboardHeader({ left, right }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="flex-1">{left}</div>
      <div className="flex-1">{right}</div>
    </div>
  );
}
