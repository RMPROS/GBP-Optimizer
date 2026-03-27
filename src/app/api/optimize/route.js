import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert in Google Business Profile (GBP) optimization. Review the provided description and generate 3 improved alternatives.

Evaluate against these criteria:
1. First 250 characters must lead with core value proposition (what, who, why you)
2. Keywords: primary service, city/service area, secondary keywords — naturally placed, no stuffing
3. USPs: years in business, awards, certifications, specializations, guarantees, community ties
4. Customer-focused tone: active voice, benefits over features, speaks to pain points
5. Policy compliant: no URLs, phone numbers, "best price", "call now", or misleading claims
6. Use the full 750 characters: history, services, areas served, team philosophy
7. Natural and persuasive: reads like a human, not a keyword list

Use any provided business context (name, address, category) to make descriptions specific and relevant.

Respond ONLY with valid JSON, no markdown, no preamble:
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
      "rationale": "Why this works",
      "charCount": 718
    },
    {
      "label": "Community & Local-First",
      "description": "...",
      "rationale": "Why this works",
      "charCount": 702
    },
    {
      "label": "Service & Results-Driven",
      "description": "...",
      "rationale": "Why this works",
      "charCount": 744
    }
  ]
}

Each description MUST be under 750 characters. Aim for 700-749. No URLs, phone numbers, or phrases like "best" or "call now".`;

export async function POST(request) {
  try {
    const { description, businessContext } = await request.json();
    if (!description || description.trim().length < 10) {
      return Response.json({ error: "Description too short." }, { status: 400 });
    }

    const ctx = [];
    if (businessContext?.name)     ctx.push(`Business name: ${businessContext.name}`);
    if (businessContext?.address)  ctx.push(`Address: ${businessContext.address}`);
    if (businessContext?.category) ctx.push(`Category: ${businessContext.category}`);

    const userMsg = (ctx.length ? `Business context:\n${ctx.join("\n")}\n\n` : "")
      + `Current GBP description:\n\n"${description}"`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    });

    const raw = message.content.map((b) => b.text || "").join("");
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return Response.json(result);
  } catch (err) {
    console.error("Optimize error:", err);
    return Response.json({ error: "We are sorry the tool is not working right now. Please try again later." }, { status: 500 });
  }
}
