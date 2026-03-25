import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert in Google Business Profile (GBP) optimization. Your job is to review a business's current GBP description and generate 3 improved alternatives.

Evaluate and rewrite based on these criteria:
1. **First 250 characters** must contain the core value proposition (what they do, who they serve, what makes them different)
2. **Keywords**: Include primary service keyword, city/service area, secondary keywords — naturally, no stuffing
3. **USPs**: Highlight unique selling points (years in business, awards, certifications, specializations, guarantees, community involvement)
4. **Customer-focused tone**: Active voice, benefits over features, speaks to customer needs/pain points
5. **Policy compliant**: No URLs, phone numbers, promotional language ("best price!", "call now!"), misleading claims
6. **Use the full 750 characters**: Fill with business history, services list, service areas, team/philosophy
7. **Natural and persuasive**: Reads like a human wrote it, not keyword-stuffed

Use any provided business context (name, address, category) to make the descriptions more specific and relevant.

Respond ONLY with valid JSON in this exact structure (no markdown, no preamble, no trailing text):
{
  "analysis": {
    "score": 72,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "charCount": 312
  },
  "suggestions": [
    {
      "label": "Professional & Trust-Focused",
      "description": "...",
      "rationale": "Why this approach works",
      "charCount": 718
    },
    {
      "label": "Community & Local-First",
      "description": "...",
      "rationale": "Why this approach works",
      "charCount": 702
    },
    {
      "label": "Service & Results-Driven",
      "description": "...",
      "rationale": "Why this approach works",
      "charCount": 744
    }
  ]
}

Each description MUST be under 750 characters. Aim for 700–749 characters. Do not include URLs, phone numbers, or promotional phrases like "best" or "call now".`;

export async function POST(request) {
  try {
    const { description, businessContext } = await request.json();

    if (!description || description.trim().length < 10) {
      return Response.json({ error: "Description is too short." }, { status: 400 });
    }

    const contextLines = [];
    if (businessContext?.name)     contextLines.push(`Business name: ${businessContext.name}`);
    if (businessContext?.address)  contextLines.push(`Address: ${businessContext.address}`);
    if (businessContext?.category) contextLines.push(`Primary category: ${businessContext.category}`);

    const contextBlock = contextLines.length
      ? `Business context:\n${contextLines.join("\n")}\n\n`
      : "";

    const userMessage = `${contextBlock}Current Google Business Profile description:\n\n"${description}"`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw = message.content.map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return Response.json(result);
  } catch (err) {
    console.error("Optimize API error:", err);
    return Response.json(
      { error: "Failed to analyze description. Please try again." },
      { status: 500 }
    );
  }
}
