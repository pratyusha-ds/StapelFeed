import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { IngestLogDto } from "./logs.dto";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

@Injectable()
export class LogsService {
  private logs: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "INFO",
      service: "bootstrap",
      message: "Service initialized successfully",
    },
    {
      id: "2",
      timestamp: new Date().toISOString(),
      level: "WARN",
      service: "bootstrap",
      message: "Configuration file not found, using defaults",
    },
  ];

  private logSubject = new Subject<LogEntry>();

  findAll(): LogEntry[] {
    return this.logs;
  }

  getLogStream() {
    return this.logSubject.asObservable();
  }

  ingest(data: IngestLogDto): LogEntry {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: data.timestamp ?? new Date().toISOString(),
      level: data.level,
      service: data.service,
      message: data.message,
    };

    this.logs.unshift(entry);
    this.logSubject.next(entry);
    return entry;
  }
}
