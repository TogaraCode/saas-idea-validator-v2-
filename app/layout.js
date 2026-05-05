import "./globals.css";

export const metadata = {
  title: "SaaS Idea Validator",
  description: "Validate SaaS ideas with scoring, market signals, risk analysis, and optional premium AI insight.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0b1020", color: "#ffffff" }}>
        {children}
      </body>
    </html>
  )
}

