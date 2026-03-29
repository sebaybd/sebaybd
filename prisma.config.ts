import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackMongoUrl = "mongodb://127.0.0.1:27017/sebaybd_local";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? fallbackMongoUrl,
  },
});
