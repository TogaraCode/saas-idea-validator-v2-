export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { saveIdea } from "../../../lib/store"

export async function POST(req) {
  try {
    const { idea, userId } = await req.json()

    if (!idea) {
      return Response.json({ error: "Missing idea" }, { status: 400 })
    }

    const score = Math.min(100, Math.floor(idea.length * 1.2))

    const result = {
      score,
      market: Math.floor(score * 0.9),
      user: Math.floor(score * 0.85),
      monetization: Math.floor(score * 1.1),
      risks: 100 - score,
      summary: "Initial validation based on structure and clarity",
      trends: [20, 40, 60, 55, 70, score],
      competitors: ["Notion", "Slack", "Linear"],
    }

    saveIdea({
      userId: userId || "demo-user",
      idea,
      score,
    })

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}

