import express from "express";

const app = express();
const port = 5002;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "metrics-analytics-service" });
});

app.listen(port, () => {
  console.log(`metrics-analytics-service listening on port ${port}`);
});
