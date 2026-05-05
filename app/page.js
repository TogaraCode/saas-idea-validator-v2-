"use client"

import { useState } from "react"

export default function HomePage() {
  const [idea, setIdea] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyzeIdea() {
    if (!idea.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      })

      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Something went wrong." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>SaaS Idea Validator</h1>
      <p style={{ color: "#aab3c5", marginBottom: "24px" }}>
        Validate SaaS ideas with scoring, market signals, risk analysis, and optional premium AI insight.
      </p>

      <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your SaaS idea..."
          rows={6}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #24304a",
            background: "#131a2e",
            color: "#ffffff",
          }}
        />

        <button
          onClick={analyzeIdea}
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Idea"}
        </button>
      </div>

      {result && (
        <section
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "#12192b",
            border: "1px solid #24304a",
          }}
        >
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <h2 style={{ marginTop: 0 }}>Validation Results</h2>
              <p><strong>Score:</strong> {result.score}</p>
              <p><strong>Market:</strong> {result.market}</p>
              <p><strong>User Pain:</strong> {result.user}</p>
              <p><strong>Monetization:</strong> {result.monetization}</p>
              <p><strong>Risks:</strong> {result.risks}</p>
              <p><strong>Summary:</strong> {result.summary}</p>
              <p><strong>Competitors:</strong> {result.competitors?.join(", ")}</p>
            </>
          )}
        </section>
      )}
    </main>
  )
}

