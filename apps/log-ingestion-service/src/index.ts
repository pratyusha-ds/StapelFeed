import express from "express";

const app = express();
const port = 5001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "log-ingestion-service" });
});

app.listen(port, () => {
  console.log(`log-ingestion-service listening on port ${port}`);
});
