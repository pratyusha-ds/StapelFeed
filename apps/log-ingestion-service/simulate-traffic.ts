const SERVICES = ["auth-service", "payment-gateway", "inventory-api", "shipping-worker"];
const LEVELS = ["INFO", "WARN", "ERROR"];
const MESSAGES = [
  "User authenticated successfully",
  "Cache miss on product lookup",
  "Failed to connect to credit card processor",
  "Webhook delivery failed, retrying...",
  "CPU utilization exceeded 85%",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDelay(): number {
  return Math.floor(Math.random() * 2000) + 2000;
}

async function sendLog(): Promise<void> {
  const body = {
    level: randomItem(LEVELS),
    service: randomItem(SERVICES),
    message: randomItem(MESSAGES),
  };

  try {
    const res = await fetch("http://localhost:3001/logs/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log(`[+] Dispatched ${body.level} ${body.service}: ${body.message}`);
    } else {
      console.error(`[-] API responded ${res.status}`);
    }
  } catch (err) {
    console.error("[-] Request failed:", (err as Error).message);
  }
}

function scheduleNext(): void {
  setTimeout(() => {
    sendLog().then(() => scheduleNext());
  }, randomDelay());
}

console.log("[*] Starting traffic simulation against http://localhost:3001\n");
scheduleNext();
