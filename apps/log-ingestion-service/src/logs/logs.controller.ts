import { Controller, Get, Post, Body, Res, UsePipes, Sse, MessageEvent } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Observable, map } from "rxjs";
import { LogsService } from "./logs.service";
import { ZodValidationPipe } from "../zod-validation.pipe";
import { IngestLogSchema, IngestLogDto } from "./logs.dto";

@Controller("logs")
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(): any[] {
    return this.logsService.findAll();
  }

  @Sse("stream")
  streamLogs(): Observable<MessageEvent> {
    return this.logsService
      .getLogStream()
      .pipe(map((log) => ({ data: log }) as MessageEvent));
  }

  @Post("ingest")
  @UsePipes(new ZodValidationPipe(IngestLogSchema))
  ingest(@Body() body: IngestLogDto, @Res() reply: FastifyReply) {
    const entry = this.logsService.ingest(body);
    reply.status(201).send(entry);
  }
}
