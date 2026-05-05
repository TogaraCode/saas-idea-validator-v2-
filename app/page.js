"use client"

import { useMemo, useState } from "react"

function MetricBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 14,
          color: "#b7c2d8",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#ffffff", fontWeight: 700 }}>{value}/100</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 12,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 999,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: `${Math.max(6, value)}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
      </div>
    </div>
  )
}

function ScoreRing({ score }) {
  const glow =
    score >= 80
      ? "#16f2b3"
      : score >= 60
      ? "#00d4ff"
      : "#ff6b6b"

  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: `radial-gradient(circle at center, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.02) 70%)`,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 0 40px ${glow}33, inset 0 0 30px rgba(255,255,255,0.04)`,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: 136,
          height: 136,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "#081120",
          border: `2px solid ${glow}`,
          boxShadow: `0 0 24px ${glow}66`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#97a4bd", letterSpacing: 1.5 }}>
            SIGNAL
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>
            {score}
          </div>
        </div>
      </div>
    </div>
  )
}

function TinyBarChart({ values = [] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        gap: 10,
        height: 150,
        paddingTop: 12,
      }}
    >
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              height: `${Math.max(v, 10)}%`,
              minHeight: 18,
              borderRadius: "14px 14px 6px 6px",
              background:
                i === values.length - 1
                  ? "linear-gradient(180deg, #16f2b3, #00d4ff)"
                  : "linear-gradient(180deg, #7c3aed, #00d4ff)",
              boxShadow:
                i === values.length - 1
                  ? "0 0 24px rgba(22,242,179,0.45)"
                  : "0 0 18px rgba(124,58,237,0.35)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#8e9bb3" }}>
            W{i + 1}
          </div>
        </div>
      ))}
    </div>
  )
}

function DataCard({ title, value, sub, glow }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 22,
        background: "linear-gradient(180deg, rgba(18,25,43,0.95), rgba(10,15,28,0.96))",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 0 24px ${glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <div style={{ fontSize: 12, color: "#8e9bb3", letterSpacing: 1.2, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#ffffff", marginTop: 10 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#aab3c5", marginTop: 6 }}>{sub}</div>
    </div>
  )
}

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

  const matrix = useMemo(() => {
    if (!result || result.error) return []
    return [
      { label: "Market Demand", value: result.market, color: "linear-gradient(90deg, #00d4ff, #16f2b3)" },
      { label: "User Pain", value: result.user, color: "linear-gradient(90deg, #7c3aed, #00d4ff)" },
      { label: "Monetization", value: result.monetization, color: "linear-gradient(90deg, #16f2b3, #ffe66d)" },
      { label: "Risk Buffer", value: Math.max(100 - result.risks, 8), color: "linear-gradient(90deg, #ff8a00, #ff3d81)" },
    ]
  }, [result])

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(0,212,255,0.18), transparent 22%), radial-gradient(circle at top right, rgba(124,58,237,0.18), transparent 24%), linear-gradient(180deg, #040814 0%, #08101f 40%, #050915 100%)",
        color: "#ffffff",
        padding: "28px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#9fb3d1",
                fontSize: 12,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Elite AI Validation Console
            </div>

            <h1
              style={{
                fontSize: "clamp(34px, 6vw, 64px)",
                lineHeight: 1,
                margin: "0 0 14px",
                letterSpacing: -1.8,
              }}
            >
              SaaS Idea Validator
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 760,
                color: "#a9b6ce",
                fontSize: 17,
                lineHeight: 1.7,
              }}
            >
              Turn rough startup ideas into premium founder-grade signal reports with instant scoring,
              risk analysis, competitor context, and visually rich validation outputs.
            </p>
          </div>

          <div
            style={{
              minWidth: 250,
              padding: 18,
              borderRadius: 24,
              background: "linear-gradient(180deg, rgba(18,25,43,0.92), rgba(8,14,28,0.95))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 28px rgba(0,212,255,0.10)",
            }}
          >
            <div style={{ fontSize: 12, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.2 }}>
              System State
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12 }}>Operational</div>
            <div style={{ color: "#9fb3d1", marginTop: 8, fontSize: 14 }}>
              Founder intelligence engine ready for live idea analysis.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 22,
            alignItems: "start",
          }}
        >
          <section
            style={{
              padding: 22,
              borderRadius: 28,
              background: "linear-gradient(180deg, rgba(17,24,39,0.94), rgba(7,12,24,0.96))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 34px rgba(124,58,237,0.10), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: 13, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.4 }}>
              Submit idea
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your SaaS idea, target audience, core problem, pricing angle, and what makes it defensible..."
              rows={8}
              style={{
                width: "100%",
                marginTop: 18,
                padding: 18,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "#ffffff",
                fontSize: 15,
                lineHeight: 1.6,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={analyzeIdea}
                style={{
                  padding: "14px 20px",
                  borderRadius: 16,
                  border: "none",
                  background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: 0.3,
                  boxShadow: "0 0 24px rgba(0,212,255,0.35)",
                }}
              >
                {loading ? "Running analysis..." : "Run validation"}
              </button>

              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#9fb3d1",
                  fontSize: 14,
                }}
              >
                Live scoring • competitor framing • premium signal board
              </div>
            </div>
          </section>

          <section
            style={{
              padding: 22,
              borderRadius: 28,
              background: "linear-gradient(180deg, rgba(12,18,32,0.96), rgba(7,10,20,0.98))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 34px rgba(0,212,255,0.08)",
            }}
          >
            <div style={{ fontSize: 13, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.4 }}>
              Forecast preview
            </div>
            <TinyBarChart values={result?.trends || [34, 52, 61, 58, 72, 84]} />
            <div style={{ marginTop: 14, color: "#a9b6ce", fontSize: 14, lineHeight: 1.7 }}>
              Visual trend projection updates after each idea submission and highlights overall opportunity momentum.
            </div>
          </section>
        </div>

        {result && (
          <section style={{ marginTop: 26 }}>
            {result.error ? (
              <div
                style={{
                  padding: 22,
                  borderRadius: 24,
                  background: "rgba(255,107,107,0.08)",
                  border: "1px solid rgba(255,107,107,0.18)",
                }}
              >
                {result.error}
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.9fr 1.1fr",
                    gap: 22,
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 30,
                      background: "linear-gradient(180deg, rgba(13,18,31,0.98), rgba(9,13,25,0.98))",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 0 38px rgba(22,242,179,0.10)",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 18 }}>
                      Core signal
                    </div>
                    <ScoreRing score={result.score} />
                    <div style={{ marginTop: 18, textAlign: "center", color: "#9fb3d1", fontSize: 15, lineHeight: 1.7 }}>
                      {result.summary}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 16,
                    }}
                  >
                    <DataCard title="Market Score" value={result.market} sub="Demand and expansion signal" glow="rgba(0,212,255,0.16)" />
                    <DataCard title="User Pain" value={result.user} sub="Urgency and felt problem strength" glow="rgba(124,58,237,0.16)" />
                    <DataCard title="Monetization" value={result.monetization} sub="Revenue potential and pricing room" glow="rgba(22,242,179,0.14)" />
                    <DataCard title="Risk Index" value={result.risks} sub="Execution and market friction exposure" glow="rgba(255,107,107,0.14)" />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 22,
                    marginTop: 22,
                  }}
                >
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 28,
                      background: "linear-gradient(180deg, rgba(16,22,37,0.95), rgba(8,12,23,0.98))",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 18 }}>
                      Validation matrix
                    </div>

                    {matrix.map((item) => (
                      <MetricBar
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      padding: 24,
                      borderRadius: 28,
                      background: "linear-gradient(180deg, rgba(12,18,33,0.96), rgba(8,12,23,0.98))",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#8e9bb3", textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 18 }}>
                      Competitor field
                    </div>

                    <div style={{ display: "grid", gap: 14 }}>
                      {(result.competitors || []).map((comp, index) => (
                        <div
                          key={comp}
                          style={{
                            padding: 16,
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>{comp}</div>
                            <div style={{ color: "#95a5bf", fontSize: 13, marginTop: 4 }}>
                              Comparable market reference point
                            </div>
                          </div>
                          <div
                            style={{
                              minWidth: 44,
                              height: 44,
                              display: "grid",
                              placeItems: "center",
                              borderRadius: 14,
                              background: "linear-gradient(180deg, rgba(0,212,255,0.18), rgba(124,58,237,0.18))",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#ffffff",
                              fontWeight: 800,
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
