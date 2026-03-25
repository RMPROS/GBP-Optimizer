import { neon } from "@neondatabase/serverless";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const logs = await sql`
      SELECT * FROM usage_logs
      ORDER BY created_at DESC
      LIMIT 500
    `;

    const total = await sql`SELECT COUNT(*) as count FROM usage_logs`;
    const today = await sql`
      SELECT COUNT(*) as count FROM usage_logs
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `;
    const thisWeek = await sql`
      SELECT COUNT(*) as count FROM usage_logs
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `;

    return Response.json({
      logs,
      stats: {
        total: total[0].count,
        today: today[0].count,
        thisWeek: thisWeek[0].count,
      }
    });
  } catch (err) {
    console.error("Logs fetch error:", err);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
