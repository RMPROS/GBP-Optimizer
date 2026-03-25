import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const { businessName, businessAddress, businessCategory, descriptionLength } = await request.json();

    const sql = neon(process.env.DATABASE_URL);

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id SERIAL PRIMARY KEY,
        business_name TEXT,
        business_address TEXT,
        business_category TEXT,
        description_length INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO usage_logs (business_name, business_address, business_category, description_length)
      VALUES (${businessName || "Unknown"}, ${businessAddress || ""}, ${businessCategory || ""}, ${descriptionLength || 0})
    `;

    return Response.json({ success: true });
  } catch (err) {
    console.error("Log error:", err);
    return Response.json({ error: "Failed to log" }, { status: 500 });
  }
}
