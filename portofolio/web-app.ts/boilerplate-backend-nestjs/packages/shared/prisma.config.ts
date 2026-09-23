import "dotenv/config";
import { defineConfig } from "prisma/config";
import config from "./src/config/database.js";

export default defineConfig({
  schema: "src/prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: config.DATABASE_URL,
  },
});
