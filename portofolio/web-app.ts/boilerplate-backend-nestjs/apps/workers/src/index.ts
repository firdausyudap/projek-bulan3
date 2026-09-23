import "dotenv/config";
import { Worker } from "bullmq";
import { getPrisma } from "@repo/shared/infrastructure/database/client";

console.log("Workers starting...");

const prisma = getPrisma();

const worker = new Worker("main-queue", async (job) => {
  console.log(`[Worker] Processing job ${job.id}...`);
  
  // Example DB interaction
  const user = await prisma.users.findFirst();
  console.log(`[Worker] Found user: ${user?.email}`);
  
}, {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  }
});

worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed!`);
});
