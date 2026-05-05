export default function PricingPage() {
  return (
    <main style={{ padding: "24px", color: "white", background: "#0b1020", minHeight: "100vh" }}>
      <h1>Pricing</h1>
      <div style={{ display: "grid", gap: "16px", maxWidth: "800px" }}>
        <div style={{ padding: "16px", border: "1px solid #24304a", borderRadius: "12px" }}>
          <h2>Free</h2>
          <p>Basic SaaS idea scoring and structured validation.</p>
        </div>
        <div style={{ padding: "16px", border: "1px solid #24304a", borderRadius: "12px" }}>
          <h2>Pro</h2>
          <p>Advanced analysis, better outputs, and premium founder tools.</p>
        </div>
        <div style={{ padding: "16px", border: "1px solid #24304a", borderRadius: "12px" }}>
          <h2>Elite</h2>
          <p>Premium AI insight, founder brief, and deeper strategic guidance.</p>
        </div>
      </div>
    </main>
  )
}

