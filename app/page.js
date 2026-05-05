"use client";

import { useEffect, useMemo, useState } from "react";

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/123bd5a0-9d16-4c28-9aff-2d705d6e5a2d.png",
    alt: "SaaEvol futuristic banner showing SaaS idea evaluation workflow and visual product intelligence",
  },
  {
    id: 2,
    image:
      "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/494d2541-9c72-42c4-be59-8da7d92444ab.png",
    alt: "SaaEvol premium SaaS evaluation dashboard showing scoring, decision flows, and analytics panels",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$0",
    subtext: "For early concept checks",
    badge: "Explore",
    features: [
      "Basic SaaS idea score",
      "Market-need risk snapshot",
      "Problem clarity guidance",
      "One-project workspace",
    ],
    metric: "Best for early filtering",
    stat: "Built for the 42% market-need failure risk founders want to avoid first",
  },
  {
    name: "Pro",
    price: "$29",
    subtext: "per month",
    badge: "Most Popular",
    features: [
      "Advanced evaluation model",
      "ICP and monetization guidance",
      "Competitor and positioning signals",
      "Priority scoring views and export-ready outputs",
    ],
    metric: "Typical SaaS trial-to-paid benchmark",
    stat: "Good SaaS trial conversion often lands around 15–25% when value is clear",
  },
  {
    name: "Scale",
    price: "$149",
    subtext: "per month",
    badge: "Teams",
    features: [
      "Unlimited projects",
      "Portfolio and workspace workflows",
      "Team collaboration and approval layers",
      "Decision dashboards for repeatable SaaS evaluation",
    ],
    metric: "Enterprise decision clarity",
    stat: "Teams with stronger activation and onboarding clarity materially improve adoption and retention",
  },
];

function clampValue(value) {
  return Math.max(0, Math.min(100, value));
}

function InsightList({ items }) {
  return (
    <ul className="cyber-list">
      {items.map((item, index) => (
        >,
          <span className="cyber-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MetricBar({ label, value }) {
  const safe = clampValue(value);
  return (
    <div className="cyber-bar-row">
      <div className="cyber-bar-top">
        <span>{label}</span>
        <span>{safe}%</span>
      </div>
      <div className="cyber-bar-track">
        <div className="cyber-bar-fill" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || autoplayPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplayPaused]);

  const analysis = useMemo(() => {
    const text = idea.trim().toLowerCase();
    const lengthBoost = Math.min(text.length / 2, 28);
    const keywordBoost =
      (text.includes("ai") ? 8 : 0) +
      (text.includes("saas") ? 10 : 0) +
      (text.includes("subscription") ? 8 : 0) +
      (text.includes("marketplace") ? 6 : 0) +
      (text.includes("automation") ? 7 : 0);

    const base = 42 + lengthBoost + keywordBoost;

    const demand = clampValue(Math.round(base + 4));
    const moat = clampValue(Math.round(base - 8));
    const feasibility = clampValue(Math.round(base + 2));
    const monetization = clampValue(Math.round(base + 6));
    const score = Math.round((demand + moat + feasibility + monetization) / 4);

    return {
      score,
      demand,
      moat,
      feasibility,
      monetization,
      workflow: [
        "Input the SaaS concept.",
        "Map risk, demand, monetization, and execution signals.",
        "Review the score and act with conviction.",
      ],
      insights: [
        "42% of startup failure analysis is tied to no market need, so early evaluation is one of the highest-leverage founder actions.",
        "Freemium products often convert only 2–5%, which means the product story and activation path must be sharp early.",
        "Strong onboarding and activation design directly improve evaluation usefulness and conversion potential.",
      ],
      actions: [
        "Clarify who the buyer is and what painful problem gets solved.",
        "Pressure-test willingness to pay before feature expansion.",
        "Use the score to refine, validate, or drop the idea quickly.",
      ],
    };
  }, [idea]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <main id="main-content" className="cyber-shell">
      <header className="sa-navbar">
        <div className="sa-navbar__inner">
          <div className="sa-brand">
            <div className="sa-logo" aria-hidden="true">
              <span className="sa-logo-core">SE</span>
            </div>
            <div>
              <div className="sa-brand-mark">SaaEvol</div>
              <div className="sa-brand-name">Evolve ideas into investable SaaS decisions</div>
            </div>
          </div>

          <div className="sa-nav-actions">
            <button
              type="button"
              className={`sa-auth-toggle ${isLoggedIn ? "is-logged-in" : ""}`}
              aria-pressed={isLoggedIn}
              onClick={() => setIsLoggedIn((prev) => !prev)}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>

            <div className="sa-menu-wrap">
              <button
                type="button"
                className={`sa-menu-button ${menuOpen ? "is-open" : ""}`}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                aria-controls="sa-drawer"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span />
                <span />
                <span />
              </button>

              <aside
                id="sa-drawer"
                className={`sa-drawer ${menuOpen ? "is-open" : ""}`}
                aria-hidden={!menuOpen}
              >
                <button type="button" className="sa-drawer-link">My Projects</button>
                <button type="button" className="sa-drawer-link">Account</button>
                <button type="button" className="sa-drawer-link">Settings</button>
              </aside>
            </div>
          </div>
        </div>
      </header>

      <section
        className="sa-hero-carousel cyber-hero-card cyber-corner-cut"
        aria-label="SaaEvol hero carousel"
        aria-roledescription="carousel"
        onMouseEnter={() => setAutoplayPaused(true)}
        onMouseLeave={() => setAutoplayPaused(false)}
      >
        <div className="cyber-grid-lines" />
        <div className="cyber-noise" />

        <div className="sa-hero-media">
          <img src={currentSlide.image} alt={currentSlide.alt} className="sa-hero-image" />
        </div>

        <div className="cyber-holo-line" />
      </section>

      <div className="sa-carousel-dots" role="tablist" aria-label="Hero slide navigation">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`Show slide ${index + 1}`}
            className={`sa-dot ${activeSlide === index ? "is-active" : ""}`}
            onClick={() => {
              setActiveSlide(index);
              setAutoplayPaused(true);
            }}
          />
        ))}
      </div>

      <section className="sa-explainer">
        <div className="sa-explainer-copy">
          <div className="cyber-kicker">SaaEvol // SaaS Evaluation Intelligence</div>
          <h1 className="sa-section-display">
            Evolve raw SaaS concepts into premium evaluation signals.
          </h1>
          <p className="cyber-subtitle">
            SaaEvol helps founders and teams assess market need, monetization logic, execution difficulty,
            and product defensibility before they commit serious build time.
          </p>
        </div>

        <div className="sa-workflow-card cyber-card cyber-corner-cut">
          <div className="cyber-grid-lines" />
          <div className="cyber-noise" />
          <div className="cyber-card-inner">
            <div className="sa-workflow-model">
              <div className="sa-node">Input</div>
              <div className="sa-arrow">→</div>
              <div className="sa-node">Evaluate</div>
              <div className="sa-arrow">→</div>
              <div className="sa-node">Model</div>
              <div className="sa-arrow">→</div>
              <div className="sa-node">Decide</div>
            </div>
            <div className="cyber-divider" />
            <InsightList items={analysis.workflow} />
          </div>
          <div className="cyber-holo-line" />
        </div>
      </section>

      <section className="sa-main-grid">
        <div className="sa-input-column">
          <article className="cyber-panel cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-panel-inner">
              <div className="cyber-section-title">Evaluation Console</div>
              <p className="cyber-muted">
                Enter your SaaS concept below and generate an evaluation signal with premium visual feedback.
              </p>

              <div className="cyber-divider" />

              <div className="sa-input-shell">
                <div className="sa-input-glow" />
                <textarea
                  className="sa-special-input"
                  placeholder="Describe your SaaS idea, target customer, core pain point, pricing model, and why the market will care..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
              </div>

              <div className="cyber-pill-row">
                <button
                  className="sa-luminous-button"
                  type="button"
                  onClick={() => setSubmitted(true)}
                >
                  Enter Evaluation
                </button>
              </div>
            </div>
            <div className="cyber-holo-line" />
          </article>

          {submitted && (
            <article className="cyber-chart cyber-corner-cut">
              <div className="cyber-grid-lines" />
              <div className="cyber-noise" />
              <div className="cyber-chart-inner">
                <div className="cyber-section-title">Evaluation Response</div>
                <p className="cyber-muted">
                  Your score appears directly underneath the input to keep the decision flow focused.
                </p>

                <div className="cyber-divider" />

                <div className="sa-score-grid">
                  <div className="sa-score-panel">
                    <div
                      className="cyber-score-ring"
                      style={{
                        background: `radial-gradient(circle at center, rgba(5,8,22,0.95) 0 53%, transparent 54%), conic-gradient(var(--cyan) 0 ${analysis.score}%, rgba(255,255,255,0.08) ${analysis.score}% 100%)`,
                      }}
                    >
                      <div className="cyber-score-value">
                        {analysis.score}
                        <span className="cyber-score-caption">Overall</span>
                      </div>
                    </div>
                  </div>

                  <div className="sa-bars-panel">
                    <MetricBar label="Demand" value={analysis.demand} />
                    <MetricBar label="Feasibility" value={analysis.feasibility} />
                    <MetricBar label="Monetization" value={analysis.monetization} />
                    <MetricBar label="Defensibility" value={analysis.moat} />
                  </div>
                </div>

                <div className="cyber-divider" />
                <InsightList items={analysis.actions} />
              </div>
              <div className="cyber-holo-line" />
            </article>
          )}
        </div>

        <div className="sa-side-column">
          <article className="cyber-card cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-card-inner">
              <div className="cyber-section-title">Evidence Layer</div>
              <InsightList items={analysis.insights} />
            </div>
            <div className="cyber-holo-line" />
          </article>
        </div>
      </section>

      <section className="sa-pricing-section">
        <div className="sa-pricing-head">
          <div className="cyber-kicker">Pricing intelligence</div>
          <h2 className="sa-section-display">Choose the evaluation depth that matches your stage.</h2>
          <p className="cyber-subtitle">
            The pricing architecture follows common SaaS practice: a clear 3-tier structure, transparent value,
            and plan differentiation based on decision complexity.
          </p>
        </div>

        <div className="sa-pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`sa-price-card cyber-card cyber-corner-cut ${plan.badge === "Most Popular" ? "is-featured" : ""}`}
            >
              <div className="cyber-grid-lines" />
              <div className="cyber-noise" />
              <div className="cyber-card-inner">
                <div className="sa-plan-badge">{plan.badge}</div>
                <h3 className="sa-plan-name">{plan.name}</h3>
                <div className="sa-plan-price">{plan.price}</div>
                <div className="sa-plan-subtext">{plan.subtext}</div>

                <div className="cyber-divider" />
                <InsightList items={plan.features} />

                <div className="cyber-divider" />
                <div className="sa-plan-stat-label">{plan.metric}</div>
                <p className="sa-plan-stat">{plan.stat}</p>
              </div>
              <div className="cyber-holo-line" />
            </article>
          ))}
        </div>

        <div className="sa-benchmark-grid">
          <article className="cyber-chart cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-chart-inner">
              <div className="cyber-section-title">Conversion Benchmarks</div>
              <MetricBar label="Visitor → Trial" value={5} />
              <MetricBar label="Trial → Paid" value={25} />
              <MetricBar label="Freemium → Paid" value={5} />
            </div>
            <div className="cyber-holo-line" />
          </article>

          <article className="cyber-chart cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-chart-inner">
              <div className="cyber-section-title">Startup Risk Pattern</div>
              <MetricBar label="Poor product-market fit" value={43} />
              <MetricBar label="Bad timing" value={29} />
              <MetricBar label="Unsustainable economics" value={19} />
            </div>
            <div className="cyber-holo-line" />
          </article>
        </div>
      </section>
    </main>
  );
}
