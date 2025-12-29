// src/pages/api/test-db.ts
import { sql } from "@vercel/postgres";

export async function GET() {
  const result = await sql`SELECT NOW()`;
  return new Response(JSON.stringify(result.rows), {
    headers: { "Content-Type": "application/json" },
  });
}
