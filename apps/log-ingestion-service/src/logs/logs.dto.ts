import { z } from "zod";

export const IngestLogSchema = z.object({
  level: z.enum(["INFO", "WARN", "ERROR"]),
  service: z.string().min(1, "service must be a non-empty string"),
  message: z.string().min(1, "message must be a non-empty string"),
  timestamp: z.string().datetime().optional(),
});

export type IngestLogDto = z.infer<typeof IngestLogSchema>;
