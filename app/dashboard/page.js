export default async function DashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ideas`, {
    cache: "no-store",
  }).catch(() => null)

  let ideas = []
  if (res && res.ok) {
    ideas = await res.json()
  }

  return (
    <main style={{ padding: "24px", color: "white", background: "#0b1020", minHeight: "100vh" }}>
      <h1>Dashboard</h1>
      {ideas.length === 0 ? (
        <p>No saved ideas yet.</p>
      ) : (
        ideas.map((item) => (
          <div key={item.id} style={{ marginBottom: "12px", padding: "12px", border: "1px solid #24304a", borderRadius: "12px" }}>
            <p><strong>Idea:</strong> {item.idea}</p>
            <p><strong>Score:</strong> {item.score}</p>
          </div>
        ))
      )}
    </main>
  )
}

