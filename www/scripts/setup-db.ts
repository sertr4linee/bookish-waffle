import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const schemaPath = path.join(process.cwd(), "lib", "db-schema.sql");
  const raw = fs.readFileSync(schemaPath, "utf-8");

  // Remove comment lines first
  const schema = raw
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");

  // Split by semicolons followed by newline
  const statements = schema
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await sql.query(statement);
      console.log("OK:", statement.slice(0, 60) + "...");
    } catch (e) {
      console.error("ERROR:", (e as Error).message);
      console.error("Statement:", statement.slice(0, 100));
    }
  }

  console.log("\nDatabase setup complete!");
}

main();
