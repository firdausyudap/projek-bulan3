import "dotenv/config";
import { CronJob } from "cron";
import { getPrisma } from "@repo/shared/infrastructure/database/client";

console.log("Schedulers starting...");

const prisma = getPrisma();

// Example Job
const job = new CronJob("* * * * *", async () => {
  const userCount = await prisma.users.count();
  console.log(`[Job] Total users in DB: ${userCount}`);
});

job.start();
