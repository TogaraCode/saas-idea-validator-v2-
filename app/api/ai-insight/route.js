export const runtime = "nodejs"

export async function POST(req) {
  try {
    const { idea } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        insight: "Premium AI insight is not configured yet. Add OPENAI_API_KEY in Vercel to enable it.",
      })
    }

    return Response.json({
      insight: `Premium AI insight for: ${idea}`,
    })
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}

