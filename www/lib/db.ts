import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function query(text: string, params?: unknown[]) {
  const result = await sql.query(text, params);
  return result.rows;
}

export { sql };

export function generateId() {
  return crypto.randomUUID();
}
