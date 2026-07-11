import React from "react";
import { render, screen } from "@testing-library/react";
import LogStreamTable from "./LogStreamTable";

const mockLogs = [
  {
    id: "1",
    timestamp: "10:00:00 AM",
    service: "auth-service",
    level: "INFO",
    message: "User authenticated",
  },
  {
    id: "2",
    timestamp: "10:00:01 AM",
    service: "payment-gateway",
    level: "WARN",
    message: "Payment declined",
  },
  {
    id: "3",
    timestamp: "10:00:02 AM",
    service: "api-router",
    level: "ERROR",
    message: "Response 502 upstream",
  },
];

describe("LogStreamTable", () => {
  it("renders service names and messages for each log entry", () => {
    render(<LogStreamTable logs={mockLogs} />);

    expect(screen.getByText("auth-service")).toBeInTheDocument();
    expect(screen.getByText("payment-gateway")).toBeInTheDocument();
    expect(screen.getByText("api-router")).toBeInTheDocument();

    expect(screen.getByText("User authenticated")).toBeInTheDocument();
    expect(screen.getByText("Payment declined")).toBeInTheDocument();
    expect(screen.getByText("Response 502 upstream")).toBeInTheDocument();
  });

  it("applies the correct badge variant for INFO level", () => {
    render(<LogStreamTable logs={[mockLogs[0]]} />);
    const badge = screen.getByText("INFO");
    expect(badge.className).toContain("text-blue-400");
  });

  it("applies the correct badge variant for WARN level", () => {
    render(<LogStreamTable logs={[mockLogs[1]]} />);
    const badge = screen.getByText("WARN");
    expect(badge.className).toContain("text-amber-400");
  });

  it("applies the correct badge variant for ERROR level", () => {
    render(<LogStreamTable logs={[mockLogs[2]]} />);
    const badge = screen.getByText("ERROR");
    expect(badge.className).toContain("text-rose-400");
  });
});
