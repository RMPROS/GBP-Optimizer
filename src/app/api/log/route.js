import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const { businessName, businessAddress, businessCategory, descriptionLength, descriptionText } = await request.json();

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id SERIAL PRIMARY KEY,
        business_name TEXT,
        business_address TEXT,
        business_category TEXT,
        description_length INTEGER,
        description_text TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Add column if it doesn't exist yet (for existing tables)
    await sql`
      ALTER TABLE usage_logs
      ADD COLUMN IF NOT EXISTS description_text TEXT
    `;

    await sql`
      INSERT INTO usage_logs (business_name, business_address, business_category, description_length, description_text)
      VALUES (${businessName || "Unknown"}, ${businessAddress || ""}, ${businessCategory || ""}, ${descriptionLength || 0}, ${descriptionText || ""})
    `;

    return Response.json({ success: true });
  } catch (err) {
    console.error("Log error:", err);
    return Response.json({ error: "Failed to log" }, { status: 500 });
  }
}
