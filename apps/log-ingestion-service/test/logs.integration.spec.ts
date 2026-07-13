import "reflect-metadata";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "../src/app.module";

describe("Logs Integration", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /logs returns the seed entries", async () => {
    const res = await app.inject({ method: "GET", url: "/logs" });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveLength(2);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("level");
    expect(body[0]).toHaveProperty("service");
    expect(body[0]).toHaveProperty("message");
  });

  it("POST /logs/ingest creates a log entry and returns 201", async () => {
    const payload = {
      level: "ERROR",
      service: "payment-gateway",
      message: "Connection refused",
    };

    const res = await app.inject({
      method: "POST",
      url: "/logs/ingest",
      payload,
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.level).toBe("ERROR");
    expect(body.service).toBe("payment-gateway");
    expect(body.message).toBe("Connection refused");
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("timestamp");
  });

  it("POST /logs/ingest rejects missing required fields", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/logs/ingest",
      payload: { level: "INFO" },
    });

    expect(res.statusCode).toBe(400);
  });

  it("POST /logs/ingest rejects invalid level value", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/logs/ingest",
      payload: {
        level: "CRITICAL",
        service: "auth",
        message: "test",
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("POST /logs/ingest rejects empty service string", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/logs/ingest",
      payload: {
        level: "INFO",
        service: "",
        message: "test",
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("GET /logs/stream returns SSE content-type", async () => {
    await app.listen(0);
    const url = await app.getUrl();

    const response = await fetch(`${url}/logs/stream`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");

    if (response.body) {
      await response.body.cancel();
    }
  });
});
