"use client";

import { useEffect, useMemo, useState } from "react";

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/123bd5a0-9d16-4c28-9aff-2d705d6e5a2d.png",
    alt: "SIV futuristic workflow banner showing idea input, AI analysis, and action outputs",
  },
  {
    id: 2,
    image:
      "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/494d2541-9c72-42c4-be59-8da7d92444ab.png",
    alt: "SIV upload and dashboard banner showing drag and drop, AI validation, score dashboard, and decision workflow",
  },
];

function clampValue(value) {
  return Math.max(0, Math.min(100, value));
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

function InsightList({ items }) {
  return (
    <ul className="cyber-list">
      {items.map((item, index) => (
        <li key={index} className="cyber-list-item">
          <span className="cyber-dot" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedName, setUploadedName] = useState("");
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
      (text.includes("mobile") ? 7 : 0) +
      (text.includes("marketplace") ? 6 : 0);

    const fileBoost = uploadedName ? 8 : 0;
    const base = 42 + lengthBoost + keywordBoost + fileBoost;

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
      insights: [
        "SIV turns raw founder thinking into a clearer product signal before time gets wasted on weak execution paths.",
        "The app is useful because it compresses ideation, evaluation, and decision-making into one fast workflow.",
        "Uploading supporting files gives the validator more context and makes the recommendations stronger.",
      ],
      workflow: [
        "Enter a SaaS idea or drag in supporting material.",
        "SIV evaluates opportunity, build fit, monetization, and defensibility.",
        "You get a score, guidance, and a next-step decision path you can act on immediately.",
      ],
      actions: [
        "Tighten the audience and pain point statement.",
        "Test willingness to pay before feature expansion.",
        "Use the score panel to decide whether to refine, pivot, or build.",
      ],
    };
  }, [idea, uploadedName]);

  const currentSlide = HERO_SLIDES[activeSlide];

  function handleFile(file) {
    if (!file) return;
    setUploadedName(file.name);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  return (
    <main id="main-content" className="cyber-shell">
      <header className="siv-navbar">
        <div className="siv-navbar__inner">
          <div className="siv-brand">
            <div className="cyber-logo" aria-hidden="true" />
            <div>
              <div className="siv-brand-mark">SIV</div>
              <div className="siv-brand-name">SaaS Idea Validator</div>
            </div>
          </div>

          <button
            type="button"
            className={`siv-menu-button ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="siv-drawer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <aside
          id="siv-drawer"
          className={`siv-drawer ${menuOpen ? "is-open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <button type="button" className="siv-drawer-link">Login</button>
          <button type="button" className="siv-drawer-link">Logout</button>
          <button type="button" className="siv-drawer-link">Toggle My Projects</button>
          <button type="button" className="siv-drawer-link">Account</button>
          <button type="button" className="siv-drawer-link">Settings</button>
        </aside>
      </header>

      <section
        className="siv-hero-carousel cyber-hero-card cyber-corner-cut"
        aria-label="SIV hero carousel"
        aria-roledescription="carousel"
        onMouseEnter={() => setAutoplayPaused(true)}
        onMouseLeave={() => setAutoplayPaused(false)}
      >
        <div className="cyber-grid-lines" />
        <div className="cyber-noise" />

        <div className="siv-hero-media">
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="siv-hero-image"
          />
        </div>

        <div className="cyber-holo-line" />
      </section>

      <div
        className="siv-carousel-dots"
        role="tablist"
        aria-label="Hero slide navigation"
      >
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`Show slide ${index + 1}`}
            className={`siv-dot ${activeSlide === index ? "is-active" : ""}`}
            onClick={() => {
              setActiveSlide(index);
              setAutoplayPaused(true);
            }}
          />
        ))}
      </div>

      <section className="siv-explainer">
        <div className="siv-explainer-copy">
          <div className="cyber-kicker">SIV // Founder Workflow Intelligence</div>
          <h1 className="siv-section-display">
            Validate SaaS ideas with a neon-fast decision workflow.
          </h1>
          <p className="cyber-subtitle">
            SIV helps founders understand whether an idea deserves refinement, testing,
            or execution by turning rough inputs into clear visual reasoning.
          </p>
        </div>

        <div className="siv-workflow-card cyber-card cyber-corner-cut">
          <div className="cyber-grid-lines" />
          <div className="cyber-noise" />
          <div className="cyber-card-inner">
            <div className="siv-workflow-model">
              <div className="siv-node">1. Input</div>
              <div className="siv-arrow">→</div>
              <div className="siv-node">2. Analyze</div>
              <div className="siv-arrow">→</div>
              <div className="siv-node">3. Score</div>
              <div className="siv-arrow">→</div>
              <div className="siv-node">4. Decide</div>
            </div>

            <div className="cyber-divider" />
            <InsightList items={analysis.workflow} />
          </div>
          <div className="cyber-holo-line" />
        </div>
      </section>

      <section className="siv-main-grid">
        <div className="siv-input-column">
          <article className="cyber-panel cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-panel-inner">
              <div className="cyber-section-title">Input Console</div>
              <p className="cyber-muted">
                Paste your SaaS idea below or upload a file for stronger validation context.
              </p>

              <div className="cyber-divider" />

              <textarea
                className="cyber-textarea"
                placeholder="Example: An AI tool that helps solo founders validate SaaS ideas, compare pricing angles, and generate launch-ready action steps..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />

              <div
                className={`siv-dropzone ${dragActive ? "is-active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
              >
                <input
                  id="siv-file-upload"
                  type="file"
                  className="siv-file-input"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <label htmlFor="siv-file-upload" className="siv-dropzone-label">
                  <span className="siv-dropzone-title">Drag and drop a file</span>
                  <span className="siv-dropzone-text">
                    or tap to upload notes, screenshots, PDFs, or research
                  </span>
                  {uploadedName ? (
                    <span className="siv-uploaded-name">Uploaded: {uploadedName}</span>
                  ) : null}
                </label>
              </div>

              <div className="cyber-pill-row">
                <button
                  className="cyber-button"
                  type="button"
                  onClick={() => setSubmitted(true)}
                >
                  Enter Signal
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
                <div className="cyber-section-title">Validation Response</div>
                <p className="cyber-muted">
                  Your result appears directly underneath the input area to keep the workflow focused and easy to follow.
                </p>

                <div className="cyber-divider" />

                <div className="siv-score-summary">
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

                <div className="cyber-chart-bars">
                  <MetricBar label="Demand" value={analysis.demand} />
                  <MetricBar label="Feasibility" value={analysis.feasibility} />
                  <MetricBar label="Monetization" value={analysis.monetization} />
                  <MetricBar label="Defensibility" value={analysis.moat} />
                </div>

                <div className="cyber-divider" />
                <InsightList items={analysis.actions} />
              </div>
              <div className="cyber-holo-line" />
            </article>
          )}
        </div>

        <div className="siv-side-column">
          <article className="cyber-card cyber-corner-cut">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-card-inner">
              <div className="cyber-section-title">Why it is useful</div>
              <InsightList items={analysis.insights} />
            </div>
            <div className="cyber-holo-line" />
          </article>
        </div>
      </section>
    </main>
  );
}
