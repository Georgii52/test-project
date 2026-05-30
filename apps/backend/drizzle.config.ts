import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
