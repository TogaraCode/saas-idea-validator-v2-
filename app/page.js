"use client"

import { useEffect, useMemo, useRef, useState } from "react";

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

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "€19",
    period: "/month",
    badge: "For solo founders",
    tagline: "Validate one idea with strong structure and clear next steps.",
    features: [
      "1 active validation workspace",
      "Core scoring model",
      "Source quality checklist",
      "Action-oriented idea guidance",
    ],
    details: [
      "Designed for solo founders testing one promising concept at a time.",
      "Good fit when you need a structured signal before spending weeks building.",
      "Includes the quality-control model so evidence is weighted, not guessed.",
    ],
    cta: "Start Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€49",
    period: "/month",
    badge: "Most popular",
    tagline: "Compare ideas, score evidence, and move from signal to decision faster.",
    features: [
      "10 active validation workspaces",
      "Evidence weighting engine",
      "Decision matrix and confidence scoring",
      "Pricing and positioning comparison support",
    ],
    details: [
      "Built for active founders refining multiple SaaS opportunities.",
      "Useful when monetization, feasibility, and defensibility need deeper review.",
      "Best plan for going from rough concepts to a more investment-worthy thesis.",
    ],
    cta: "Choose Pro",
  },
  {
    id: "team",
    name: "Team",
    price: "€99",
    period: "/month",
    badge: "For teams",
    tagline:
      "Run collaborative validation workflows across several ideas and stakeholders.",
    features: [
      "Unlimited workspaces",
      "Shared review logic",
      "Priority support",
      "Team-ready evidence audit trails",
    ],
    details: [
      "Made for cofounders, studios, and small product teams evaluating several bets.",
      "Helps keep research quality consistent across team members.",
      "Adds process discipline when decisions need to be defensible later.",
    ],
    cta: "Talk to sales",
  },
];

const RESEARCH_PROMPT = `You are operating as a Scientific Research, Verification, and Decision Intelligence System.

Your primary objective is not speed.
Your primary objective is to gather the most reliable, evidence-based, scientifically valid, and decision-relevant information possible.

Prioritize:
- Accuracy
- Reliability
- Scientific rigor
- Verifiable evidence
- Transparency
- Data quality
- Trustworthiness
- Reproducibility

Source priority hierarchy:
Tier 1: peer-reviewed journals, meta-analyses, systematic reviews, government datasets, scientific institutions.
Tier 2: established industry reports, public company filings, large-scale surveys, research organizations.
Tier 3: major news organizations, expert interviews, verified case studies, reputable blogs with citations.
Tier 4: anecdotal reports, opinion pieces, social media claims, marketing material.

For every source, evaluate scientific validity, source reliability, data quality, and decision relevance. Score each true criterion with +1 and compute:
Quality Score = (True Answers / Total Questions) * 100.

Thresholds:
90-100 = HIGH TRUST
75-89 = MODERATE TRUST
60-74 = LOW TRUST
Below 60 = REJECTED

If evidence is weak, disclose limitations clearly and reduce confidence accordingly.`;

const EVIDENCE_SCHEMA = {
  source_id: "string",
  source_type:
    "peer_reviewed_journal | meta_analysis | systematic_review | government_data | company_filing | industry_report | news | blog | social_media | other",
  title: "string",
  authors_or_institution: ["string"],
  publication_date: "ISO_8601_string",
  methodology: "string",
  sample_size: {
    value: 0,
    unit: "participants | companies | documents | null",
  },
  funding_or_conflicts: "string | null",
  geographic_relevance: "string",
  quality_checklist: {
    scientific_validity: {
      peer_reviewed_or_audited: false,
      methodology_transparent: false,
      sample_size_meaningful: false,
      conclusions_supported_by_data: false,
      confidence_intervals_or_significance: false,
      causal_claims_justified: false,
      reproducible: false,
      limitations_acknowledged: false,
    },
    source_reliability: {
      institution_reputable: false,
      authors_qualified: false,
      bias_or_conflict_indicated: false,
      independently_corroborated: false,
      widely_cited_or_referenced: false,
      recent_enough: false,
    },
    data_quality: {
      statistics_consistent: false,
      calculations_valid: false,
      datasets_complete: false,
      assumptions_stated: false,
      uncertainty_quantified: false,
    },
    decision_relevance: {
      directly_relevant: false,
      improves_decision_quality: false,
      actionable_insight: false,
      improves_confidence: false,
    },
  },
  total_true_answers: 0,
  quality_score: 0,
  quality_level: "REJECTED",
  reasoning: "string",
};

function clampValue(value) {
  return Math.max(0, Math.min(100, value));
}

function scoreEvidenceSource(source) {
  const sections = Object.values(source.quality_checklist || {});
  const values = sections.flatMap((section) => Object.values(section));
  const trueAnswers = values.filter(Boolean).length;
  const totalQuestions = values.length || 1;
  const qualityScore = Math.round((trueAnswers / totalQuestions) * 100);

  let qualityLevel = "REJECTED";
  if (qualityScore >= 90) qualityLevel = "HIGH_TRUST";
  else if (qualityScore >= 75) qualityLevel = "MODERATE_TRUST";
  else if (qualityScore >= 60) qualityLevel = "LOW_TRUST";

  return {
    ...source,
    total_true_answers: trueAnswers,
    quality_score: qualityScore,
    quality_level: qualityLevel,
  };
}

function buildResearchModelPreview(idea, uploadedName) {
  const normalized = idea.trim().toLowerCase();
  const hasText = normalized.length > 20;
  const hasFile = Boolean(uploadedName);

  const sources = [
    {
      source_id: "demo-systematic-review",
      source_type: "systematic_review",
      title: "Comparable domain review",
      authors_or_institution: ["Independent research group"],
      publication_date: "2025-02-01",
      methodology: "systematic review",
      sample_size: { value: 42, unit: "documents" },
      funding_or_conflicts: "None disclosed",
      geographic_relevance: "global",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: true,
          methodology_transparent: true,
          sample_size_meaningful: true,
          conclusions_supported_by_data: true,
          confidence_intervals_or_significance: true,
          causal_claims_justified: false,
          reproducible: true,
          limitations_acknowledged: true,
        },
        source_reliability: {
          institution_reputable: true,
          authors_qualified: true,
          bias_or_conflict_indicated: true,
          independently_corroborated: true,
          widely_cited_or_referenced: true,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: true,
          calculations_valid: true,
          datasets_complete: true,
          assumptions_stated: true,
          uncertainty_quantified: true,
        },
        decision_relevance: {
          directly_relevant: hasText,
          improves_decision_quality: true,
          actionable_insight: true,
          improves_confidence: true,
        },
      },
      reasoning:
        "High-quality evidence with transparent methods and clear decision relevance.",
    },
    {
      source_id: "demo-industry-report",
      source_type: "industry_report",
      title: "Market report with pricing and category benchmarks",
      authors_or_institution: ["Established research publisher"],
      publication_date: "2025-09-10",
      methodology: "industry survey",
      sample_size: { value: 1200, unit: "companies" },
      funding_or_conflicts: "Commercial publisher",
      geographic_relevance: "EU/US",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: false,
          methodology_transparent: true,
          sample_size_meaningful: true,
          conclusions_supported_by_data: true,
          confidence_intervals_or_significance: false,
          causal_claims_justified: false,
          reproducible: false,
          limitations_acknowledged: true,
        },
        source_reliability: {
          institution_reputable: true,
          authors_qualified: true,
          bias_or_conflict_indicated: true,
          independently_corroborated: hasFile,
          widely_cited_or_referenced: true,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: true,
          calculations_valid: true,
          datasets_complete: true,
          assumptions_stated: true,
          uncertainty_quantified: false,
        },
        decision_relevance: {
          directly_relevant: true,
          improves_decision_quality: true,
          actionable_insight: true,
          improves_confidence: true,
        },
      },
      reasoning:
        "Useful decision support evidence, but with weaker reproducibility than academic research.",
    },
    {
      source_id: "demo-blog-post",
      source_type: "blog",
      title: "Founder commentary and anecdotal market observations",
      authors_or_institution: ["Independent operator"],
      publication_date: "2026-01-12",
      methodology: "anecdotal post",
      sample_size: { value: null, unit: null },
      funding_or_conflicts: "Unknown",
      geographic_relevance: "unknown",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: false,
          methodology_transparent: false,
          sample_size_meaningful: false,
          conclusions_supported_by_data: false,
          confidence_intervals_or_significance: false,
          causal_claims_justified: false,
          reproducible: false,
          limitations_acknowledged: false,
        },
        source_reliability: {
          institution_reputable: false,
          authors_qualified: false,
          bias_or_conflict_indicated: false,
          independently_corroborated: false,
          widely_cited_or_referenced: false,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: false,
          calculations_valid: false,
          datasets_complete: false,
          assumptions_stated: false,
          uncertainty_quantified: false,
        },
        decision_relevance: {
          directly_relevant: normalized.includes("founder"),
          improves_decision_quality: false,
          actionable_insight: normalized.length > 80,
          improves_confidence: false,
        },
      },
      reasoning:
        "Low-rigor directional context only; should not drive the main recommendation.",
    },
  ].map(scoreEvidenceSource);

  const accepted = sources.filter(
    (source) => source.quality_level !== "REJECTED"
  );

  const averageQuality = accepted.length
    ? Math.round(
        accepted.reduce((sum, source) => sum + source.quality_score, 0) /
          accepted.length
      )
    : 0;

  const confidence = clampValue(
    Math.round(
      averageQuality * 0.7 +
        (hasText ? 12 : 0) +
        (hasFile ? 10 : 0) +
        Math.min(normalized.length / 10, 8)
    )
  );

  return {
    accepted,
    rejected: sources.filter((source) => source.quality_level === "REJECTED"),
    averageQuality,
    confidence,
    recommendation:
      confidence >= 80
        ? "High-confidence direction: continue validating demand and test pricing with real users."
        : confidence >= 60
          ? "Moderate-confidence direction: strengthen primary evidence before committing to build."
          : "Low-confidence direction: collect stronger Tier 1 and Tier 2 evidence before deciding.",
  };
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
  const [selectedTier, setSelectedTier] = useState(null);
  const modalCloseRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || autoplayPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplayPaused]);

  useEffect(() => {
    if (!selectedTier) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalCloseRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedTier(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTier]);

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

  const researchModel = useMemo(
    () => buildResearchModelPreview(idea, uploadedName),
    [idea, uploadedName]
  );

  const currentSlide = HERO_SLIDES[activeSlide];
  const activeTier = PRICING_TIERS.find((tier) => tier.id === selectedTier);

  function handleFile(file) {
    if (!file) return;
    setUploadedName(file.name);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
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
          <button type="button" className="siv-drawer-link">
            Login
          </button>
          <button type="button" className="siv-drawer-link">
            Logout
          </button>
          <button type="button" className="siv-drawer-link">
            Toggle My Projects
          </button>
          <button type="button" className="siv-drawer-link">
            Account
          </button>
          <button type="button" className="siv-drawer-link">
            Settings
          </button>
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
            SIV helps founders understand whether an idea deserves refinement,
            testing, or execution by turning rough inputs into clear visual
            reasoning.
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
                Paste your SaaS idea below or upload a file for stronger
                validation context.
              </p>

              <div className="cyber-divider" />

              <textarea
                className="cyber-textarea"
                placeholder="Example: An AI tool that helps solo founders validate SaaS ideas, compare pricing angles, and generate launch-ready action steps..."
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
              />

              <div
                className={`siv-dropzone ${dragActive ? "is-active" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
              >
                <input
                  id="siv-file-upload"
                  type="file"
                  className="siv-file-input"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <label htmlFor="siv-file-upload" className="siv-dropzone-label">
                  <span className="siv-dropzone-title">Drag and drop a file</span>
                  <span className="siv-dropzone-text">
                    or tap to upload notes, screenshots, PDFs, or research
                  </span>
                  {uploadedName ? (
                    <span className="siv-uploaded-name">
                      Uploaded: {uploadedName}
                    </span>
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
            <>
              <article className="cyber-chart cyber-corner-cut">
                <div className="cyber-grid-lines" />
                <div className="cyber-noise" />
                <div className="cyber-chart-inner">
                  <div className="cyber-section-title">Validation Response</div>
                  <p className="cyber-muted">
                    Your result appears directly underneath the input area to keep
                    the workflow focused and easy to follow.
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
                    <MetricBar
                      label="Feasibility"
                      value={analysis.feasibility}
                    />
                    <MetricBar
                      label="Monetization"
                      value={analysis.monetization}
                    />
                    <MetricBar label="Defensibility" value={analysis.moat} />
                  </div>

                  <div className="cyber-divider" />
                  <InsightList items={analysis.actions} />
                </div>
                <div className="cyber-holo-line" />
              </article>

              <article className="cyber-card cyber-corner-cut siv-research-card">
                <div className="cyber-grid-lines" />
                <div className="cyber-noise" />
                <div className="cyber-card-inner">
                  <div className="cyber-section-title">
                    Scientific Scraping Model
                  </div>
                  <p className="cyber-muted">
                    A JavaScript evidence-governance layer scores source quality,
                    weights accepted evidence, and lowers confidence when the
                    evidence is weak.
                  </p>

                  <div className="cyber-divider" />

                  <div className="siv-model-stats">
                    <div className="siv-model-stat">
                      <strong>{researchModel.accepted.length}</strong>
                      <span>Accepted</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.rejected.length}</strong>
                      <span>Rejected</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.averageQuality}</strong>
                      <span>Avg. Quality</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.confidence}</strong>
                      <span>Confidence</span>
                    </div>
                  </div>

                  <div className="cyber-divider" />

                  <div className="siv-source-grid">
                    {researchModel.accepted
                      .concat(researchModel.rejected)
                      .map((source) => (
                        <div key={source.source_id} className="siv-source-item">
                          <div className="siv-source-top">
                            <span
                              className={`siv-source-badge ${source.quality_level.toLowerCase()}`}
                            >
                              {source.quality_level.replace("_", " ")}
                            </span>
                            <span className="siv-source-score">
                              {source.quality_score}/100
                            </span>
                          </div>
                          <div className="siv-source-title">{source.title}</div>
                          <p className="cyber-muted">{source.reasoning}</p>
                        </div>
                      ))}
                  </div>

                  <div className="cyber-divider" />
                  <p className="cyber-muted">{researchModel.recommendation}</p>
                </div>
                <div className="cyber-holo-line" />
              </article>
            </>
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

          <article className="cyber-card cyber-corner-cut siv-code-card">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-card-inner">
              <div className="cyber-section-title">Embedded Research Prompt</div>
              <pre className="siv-code-block">{RESEARCH_PROMPT}</pre>
              <div className="cyber-divider" />
              <div className="cyber-section-title">Evidence JSON Shape</div>
              <pre className="siv-code-block">
                {JSON.stringify(EVIDENCE_SCHEMA, null, 2)}
              </pre>
            </div>
            <div className="cyber-holo-line" />
          </article>
        </div>
      </section>

      <section className="siv-pricing-section">
        <div className="siv-explainer-copy">
          <div className="cyber-kicker">SIV // Pricing Access</div>
          <h2 className="siv-section-display">
            Choose the tier that matches your validation speed.
          </h2>
          <p className="cyber-subtitle">
            Start simple, go deeper when you need stronger comparisons, and scale
            up when several people need one evidence standard.
          </p>
        </div>

        <div className="siv-pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`cyber-card cyber-corner-cut siv-tier-card ${
                tier.id === "pro" ? "is-featured" : ""
              }`}
            >
              <div className="cyber-grid-lines" />
              <div className="cyber-noise" />
              <div className="cyber-card-inner">
                <div className="siv-tier-badge">{tier.badge}</div>
                <h3 className="siv-tier-name">{tier.name}</h3>
                <div className="siv-tier-price">
                  <span>{tier.price}</span>
                  <small>{tier.period}</small>
                </div>
                <p className="cyber-muted">{tier.tagline}</p>
                <div className="cyber-divider" />
                <InsightList items={tier.features} />
                <div className="cyber-pill-row">
                  <button
                    type="button"
                    className="cyber-button"
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
              <div className="cyber-holo-line" />
            </article>
          ))}
        </div>
      </section>

      {activeTier ? (
        <div
          className="siv-modal-backdrop"
          onClick={() => setSelectedTier(null)}
        >
          <div
            className="siv-modal cyber-corner-cut"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="siv-modal-inner">
              <div className="siv-modal-top">
                <div>
                  <div className="siv-tier-badge">{activeTier.badge}</div>
                  <h3 id="tier-modal-title" className="siv-tier-name">
                    {activeTier.name}
                  </h3>
                </div>
                <button
                  ref={modalCloseRef}
                  type="button"
                  className="siv-modal-close"
                  aria-label="Close pricing details"
                  onClick={() => setSelectedTier(null)}
                >
                  ×
                </button>
              </div>

              <div className="siv-tier-price">
                <span>{activeTier.price}</span>
                <small>{activeTier.period}</small>
              </div>

              <p className="cyber-muted">{activeTier.tagline}</p>

              <div className="cyber-divider" />

              <div className="siv-modal-grid">
                <div>
                  <div className="cyber-section-title">Included</div>
                  <InsightList items={activeTier.features} />
                </div>
                <div>
                  <div className="cyber-section-title">Best for</div>
                  <InsightList items={activeTier.details} />
                </div>
              </div>

              <div className="cyber-pill-row">
                <button type="button" className="cyber-button">
                  {activeTier.cta}
                </button>
              </div>
            </div>
            <div className="cyber-holo-line" />
          </div>
        </div>
      ) : null}
    </main>
  );
}


import { useEffect, useMemo, useRef, useState } from "react";

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

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "€19",
    period: "/month",
    badge: "For solo founders",
    tagline: "Validate one idea with strong structure and clear next steps.",
    features: [
      "1 active validation workspace",
      "Core scoring model",
      "Source quality checklist",
      "Action-oriented idea guidance",
    ],
    details: [
      "Designed for solo founders testing one promising concept at a time.",
      "Good fit when you need a structured signal before spending weeks building.",
      "Includes the quality-control model so evidence is weighted, not guessed.",
    ],
    cta: "Start Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "€49",
    period: "/month",
    badge: "Most popular",
    tagline: "Compare ideas, score evidence, and move from signal to decision faster.",
    features: [
      "10 active validation workspaces",
      "Evidence weighting engine",
      "Decision matrix and confidence scoring",
      "Pricing and positioning comparison support",
    ],
    details: [
      "Built for active founders refining multiple SaaS opportunities.",
      "Useful when monetization, feasibility, and defensibility need deeper review.",
      "Best plan for going from rough concepts to a more investment-worthy thesis.",
    ],
    cta: "Choose Pro",
  },
  {
    id: "team",
    name: "Team",
    price: "€99",
    period: "/month",
    badge: "For teams",
    tagline:
      "Run collaborative validation workflows across several ideas and stakeholders.",
    features: [
      "Unlimited workspaces",
      "Shared review logic",
      "Priority support",
      "Team-ready evidence audit trails",
    ],
    details: [
      "Made for cofounders, studios, and small product teams evaluating several bets.",
      "Helps keep research quality consistent across team members.",
      "Adds process discipline when decisions need to be defensible later.",
    ],
    cta: "Talk to sales",
  },
];

const RESEARCH_PROMPT = `You are operating as a Scientific Research, Verification, and Decision Intelligence System.

Your primary objective is not speed.
Your primary objective is to gather the most reliable, evidence-based, scientifically valid, and decision-relevant information possible.

Prioritize:
- Accuracy
- Reliability
- Scientific rigor
- Verifiable evidence
- Transparency
- Data quality
- Trustworthiness
- Reproducibility

Source priority hierarchy:
Tier 1: peer-reviewed journals, meta-analyses, systematic reviews, government datasets, scientific institutions.
Tier 2: established industry reports, public company filings, large-scale surveys, research organizations.
Tier 3: major news organizations, expert interviews, verified case studies, reputable blogs with citations.
Tier 4: anecdotal reports, opinion pieces, social media claims, marketing material.

For every source, evaluate scientific validity, source reliability, data quality, and decision relevance. Score each true criterion with +1 and compute:
Quality Score = (True Answers / Total Questions) * 100.

Thresholds:
90-100 = HIGH TRUST
75-89 = MODERATE TRUST
60-74 = LOW TRUST
Below 60 = REJECTED

If evidence is weak, disclose limitations clearly and reduce confidence accordingly.`;

const EVIDENCE_SCHEMA = {
  source_id: "string",
  source_type:
    "peer_reviewed_journal | meta_analysis | systematic_review | government_data | company_filing | industry_report | news | blog | social_media | other",
  title: "string",
  authors_or_institution: ["string"],
  publication_date: "ISO_8601_string",
  methodology: "string",
  sample_size: {
    value: 0,
    unit: "participants | companies | documents | null",
  },
  funding_or_conflicts: "string | null",
  geographic_relevance: "string",
  quality_checklist: {
    scientific_validity: {
      peer_reviewed_or_audited: false,
      methodology_transparent: false,
      sample_size_meaningful: false,
      conclusions_supported_by_data: false,
      confidence_intervals_or_significance: false,
      causal_claims_justified: false,
      reproducible: false,
      limitations_acknowledged: false,
    },
    source_reliability: {
      institution_reputable: false,
      authors_qualified: false,
      bias_or_conflict_indicated: false,
      independently_corroborated: false,
      widely_cited_or_referenced: false,
      recent_enough: false,
    },
    data_quality: {
      statistics_consistent: false,
      calculations_valid: false,
      datasets_complete: false,
      assumptions_stated: false,
      uncertainty_quantified: false,
    },
    decision_relevance: {
      directly_relevant: false,
      improves_decision_quality: false,
      actionable_insight: false,
      improves_confidence: false,
    },
  },
  total_true_answers: 0,
  quality_score: 0,
  quality_level: "REJECTED",
  reasoning: "string",
};

function clampValue(value) {
  return Math.max(0, Math.min(100, value));
}

function scoreEvidenceSource(source) {
  const sections = Object.values(source.quality_checklist || {});
  const values = sections.flatMap((section) => Object.values(section));
  const trueAnswers = values.filter(Boolean).length;
  const totalQuestions = values.length || 1;
  const qualityScore = Math.round((trueAnswers / totalQuestions) * 100);

  let qualityLevel = "REJECTED";
  if (qualityScore >= 90) qualityLevel = "HIGH_TRUST";
  else if (qualityScore >= 75) qualityLevel = "MODERATE_TRUST";
  else if (qualityScore >= 60) qualityLevel = "LOW_TRUST";

  return {
    ...source,
    total_true_answers: trueAnswers,
    quality_score: qualityScore,
    quality_level: qualityLevel,
  };
}

function buildResearchModelPreview(idea, uploadedName) {
  const normalized = idea.trim().toLowerCase();
  const hasText = normalized.length > 20;
  const hasFile = Boolean(uploadedName);

  const sources = [
    {
      source_id: "demo-systematic-review",
      source_type: "systematic_review",
      title: "Comparable domain review",
      authors_or_institution: ["Independent research group"],
      publication_date: "2025-02-01",
      methodology: "systematic review",
      sample_size: { value: 42, unit: "documents" },
      funding_or_conflicts: "None disclosed",
      geographic_relevance: "global",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: true,
          methodology_transparent: true,
          sample_size_meaningful: true,
          conclusions_supported_by_data: true,
          confidence_intervals_or_significance: true,
          causal_claims_justified: false,
          reproducible: true,
          limitations_acknowledged: true,
        },
        source_reliability: {
          institution_reputable: true,
          authors_qualified: true,
          bias_or_conflict_indicated: true,
          independently_corroborated: true,
          widely_cited_or_referenced: true,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: true,
          calculations_valid: true,
          datasets_complete: true,
          assumptions_stated: true,
          uncertainty_quantified: true,
        },
        decision_relevance: {
          directly_relevant: hasText,
          improves_decision_quality: true,
          actionable_insight: true,
          improves_confidence: true,
        },
      },
      reasoning:
        "High-quality evidence with transparent methods and clear decision relevance.",
    },
    {
      source_id: "demo-industry-report",
      source_type: "industry_report",
      title: "Market report with pricing and category benchmarks",
      authors_or_institution: ["Established research publisher"],
      publication_date: "2025-09-10",
      methodology: "industry survey",
      sample_size: { value: 1200, unit: "companies" },
      funding_or_conflicts: "Commercial publisher",
      geographic_relevance: "EU/US",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: false,
          methodology_transparent: true,
          sample_size_meaningful: true,
          conclusions_supported_by_data: true,
          confidence_intervals_or_significance: false,
          causal_claims_justified: false,
          reproducible: false,
          limitations_acknowledged: true,
        },
        source_reliability: {
          institution_reputable: true,
          authors_qualified: true,
          bias_or_conflict_indicated: true,
          independently_corroborated: hasFile,
          widely_cited_or_referenced: true,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: true,
          calculations_valid: true,
          datasets_complete: true,
          assumptions_stated: true,
          uncertainty_quantified: false,
        },
        decision_relevance: {
          directly_relevant: true,
          improves_decision_quality: true,
          actionable_insight: true,
          improves_confidence: true,
        },
      },
      reasoning:
        "Useful decision support evidence, but with weaker reproducibility than academic research.",
    },
    {
      source_id: "demo-blog-post",
      source_type: "blog",
      title: "Founder commentary and anecdotal market observations",
      authors_or_institution: ["Independent operator"],
      publication_date: "2026-01-12",
      methodology: "anecdotal post",
      sample_size: { value: null, unit: null },
      funding_or_conflicts: "Unknown",
      geographic_relevance: "unknown",
      quality_checklist: {
        scientific_validity: {
          peer_reviewed_or_audited: false,
          methodology_transparent: false,
          sample_size_meaningful: false,
          conclusions_supported_by_data: false,
          confidence_intervals_or_significance: false,
          causal_claims_justified: false,
          reproducible: false,
          limitations_acknowledged: false,
        },
        source_reliability: {
          institution_reputable: false,
          authors_qualified: false,
          bias_or_conflict_indicated: false,
          independently_corroborated: false,
          widely_cited_or_referenced: false,
          recent_enough: true,
        },
        data_quality: {
          statistics_consistent: false,
          calculations_valid: false,
          datasets_complete: false,
          assumptions_stated: false,
          uncertainty_quantified: false,
        },
        decision_relevance: {
          directly_relevant: normalized.includes("founder"),
          improves_decision_quality: false,
          actionable_insight: normalized.length > 80,
          improves_confidence: false,
        },
      },
      reasoning:
        "Low-rigor directional context only; should not drive the main recommendation.",
    },
  ].map(scoreEvidenceSource);

  const accepted = sources.filter(
    (source) => source.quality_level !== "REJECTED"
  );

  const averageQuality = accepted.length
    ? Math.round(
        accepted.reduce((sum, source) => sum + source.quality_score, 0) /
          accepted.length
      )
    : 0;

  const confidence = clampValue(
    Math.round(
      averageQuality * 0.7 +
        (hasText ? 12 : 0) +
        (hasFile ? 10 : 0) +
        Math.min(normalized.length / 10, 8)
    )
  );

  return {
    accepted,
    rejected: sources.filter((source) => source.quality_level === "REJECTED"),
    averageQuality,
    confidence,
    recommendation:
      confidence >= 80
        ? "High-confidence direction: continue validating demand and test pricing with real users."
        : confidence >= 60
          ? "Moderate-confidence direction: strengthen primary evidence before committing to build."
          : "Low-confidence direction: collect stronger Tier 1 and Tier 2 evidence before deciding.",
  };
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
  const [selectedTier, setSelectedTier] = useState(null);
  const modalCloseRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || autoplayPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplayPaused]);

  useEffect(() => {
    if (!selectedTier) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalCloseRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedTier(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTier]);

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

  const researchModel = useMemo(
    () => buildResearchModelPreview(idea, uploadedName),
    [idea, uploadedName]
  );

  const currentSlide = HERO_SLIDES[activeSlide];
  const activeTier = PRICING_TIERS.find((tier) => tier.id === selectedTier);

  function handleFile(file) {
    if (!file) return;
    setUploadedName(file.name);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
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
          <button type="button" className="siv-drawer-link">
            Login
          </button>
          <button type="button" className="siv-drawer-link">
            Logout
          </button>
          <button type="button" className="siv-drawer-link">
            Toggle My Projects
          </button>
          <button type="button" className="siv-drawer-link">
            Account
          </button>
          <button type="button" className="siv-drawer-link">
            Settings
          </button>
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
            SIV helps founders understand whether an idea deserves refinement,
            testing, or execution by turning rough inputs into clear visual
            reasoning.
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
                Paste your SaaS idea below or upload a file for stronger
                validation context.
              </p>

              <div className="cyber-divider" />

              <textarea
                className="cyber-textarea"
                placeholder="Example: An AI tool that helps solo founders validate SaaS ideas, compare pricing angles, and generate launch-ready action steps..."
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
              />

              <div
                className={`siv-dropzone ${dragActive ? "is-active" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
              >
                <input
                  id="siv-file-upload"
                  type="file"
                  className="siv-file-input"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <label htmlFor="siv-file-upload" className="siv-dropzone-label">
                  <span className="siv-dropzone-title">Drag and drop a file</span>
                  <span className="siv-dropzone-text">
                    or tap to upload notes, screenshots, PDFs, or research
                  </span>
                  {uploadedName ? (
                    <span className="siv-uploaded-name">
                      Uploaded: {uploadedName}
                    </span>
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
            <>
              <article className="cyber-chart cyber-corner-cut">
                <div className="cyber-grid-lines" />
                <div className="cyber-noise" />
                <div className="cyber-chart-inner">
                  <div className="cyber-section-title">Validation Response</div>
                  <p className="cyber-muted">
                    Your result appears directly underneath the input area to keep
                    the workflow focused and easy to follow.
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
                    <MetricBar
                      label="Feasibility"
                      value={analysis.feasibility}
                    />
                    <MetricBar
                      label="Monetization"
                      value={analysis.monetization}
                    />
                    <MetricBar label="Defensibility" value={analysis.moat} />
                  </div>

                  <div className="cyber-divider" />
                  <InsightList items={analysis.actions} />
                </div>
                <div className="cyber-holo-line" />
              </article>

              <article className="cyber-card cyber-corner-cut siv-research-card">
                <div className="cyber-grid-lines" />
                <div className="cyber-noise" />
                <div className="cyber-card-inner">
                  <div className="cyber-section-title">
                    Scientific Scraping Model
                  </div>
                  <p className="cyber-muted">
                    A JavaScript evidence-governance layer scores source quality,
                    weights accepted evidence, and lowers confidence when the
                    evidence is weak.
                  </p>

                  <div className="cyber-divider" />

                  <div className="siv-model-stats">
                    <div className="siv-model-stat">
                      <strong>{researchModel.accepted.length}</strong>
                      <span>Accepted</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.rejected.length}</strong>
                      <span>Rejected</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.averageQuality}</strong>
                      <span>Avg. Quality</span>
                    </div>
                    <div className="siv-model-stat">
                      <strong>{researchModel.confidence}</strong>
                      <span>Confidence</span>
                    </div>
                  </div>

                  <div className="cyber-divider" />

                  <div className="siv-source-grid">
                    {researchModel.accepted
                      .concat(researchModel.rejected)
                      .map((source) => (
                        <div key={source.source_id} className="siv-source-item">
                          <div className="siv-source-top">
                            <span
                              className={`siv-source-badge ${source.quality_level.toLowerCase()}`}
                            >
                              {source.quality_level.replace("_", " ")}
                            </span>
                            <span className="siv-source-score">
                              {source.quality_score}/100
                            </span>
                          </div>
                          <div className="siv-source-title">{source.title}</div>
                          <p className="cyber-muted">{source.reasoning}</p>
                        </div>
                      ))}
                  </div>

                  <div className="cyber-divider" />
                  <p className="cyber-muted">{researchModel.recommendation}</p>
                </div>
                <div className="cyber-holo-line" />
              </article>
            </>
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

          <article className="cyber-card cyber-corner-cut siv-code-card">
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="cyber-card-inner">
              <div className="cyber-section-title">Embedded Research Prompt</div>
              <pre className="siv-code-block">{RESEARCH_PROMPT}</pre>
              <div className="cyber-divider" />
              <div className="cyber-section-title">Evidence JSON Shape</div>
              <pre className="siv-code-block">
                {JSON.stringify(EVIDENCE_SCHEMA, null, 2)}
              </pre>
            </div>
            <div className="cyber-holo-line" />
          </article>
        </div>
      </section>

      <section className="siv-pricing-section">
        <div className="siv-explainer-copy">
          <div className="cyber-kicker">SIV // Pricing Access</div>
          <h2 className="siv-section-display">
            Choose the tier that matches your validation speed.
          </h2>
          <p className="cyber-subtitle">
            Start simple, go deeper when you need stronger comparisons, and scale
            up when several people need one evidence standard.
          </p>
        </div>

        <div className="siv-pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`cyber-card cyber-corner-cut siv-tier-card ${
                tier.id === "pro" ? "is-featured" : ""
              }`}
            >
              <div className="cyber-grid-lines" />
              <div className="cyber-noise" />
              <div className="cyber-card-inner">
                <div className="siv-tier-badge">{tier.badge}</div>
                <h3 className="siv-tier-name">{tier.name}</h3>
                <div className="siv-tier-price">
                  <span>{tier.price}</span>
                  <small>{tier.period}</small>
                </div>
                <p className="cyber-muted">{tier.tagline}</p>
                <div className="cyber-divider" />
                <InsightList items={tier.features} />
                <div className="cyber-pill-row">
                  <button
                    type="button"
                    className="cyber-button"
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
              <div className="cyber-holo-line" />
            </article>
          ))}
        </div>
      </section>

      {activeTier ? (
        <div
          className="siv-modal-backdrop"
          onClick={() => setSelectedTier(null)}
        >
          <div
            className="siv-modal cyber-corner-cut"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cyber-grid-lines" />
            <div className="cyber-noise" />
            <div className="siv-modal-inner">
              <div className="siv-modal-top">
                <div>
                  <div className="siv-tier-badge">{activeTier.badge}</div>
                  <h3 id="tier-modal-title" className="siv-tier-name">
                    {activeTier.name}
                  </h3>
                </div>
                <button
                  ref={modalCloseRef}
                  type="button"
                  className="siv-modal-close"
                  aria-label="Close pricing details"
                  onClick={() => setSelectedTier(null)}
                >
                  ×
                </button>
              </div>

              <div className="siv-tier-price">
                <span>{activeTier.price}</span>
                <small>{activeTier.period}</small>
              </div>

              <p className="cyber-muted">{activeTier.tagline}</p>

              <div className="cyber-divider" />

              <div className="siv-modal-grid">
                <div>
                  <div className="cyber-section-title">Included</div>
                  <InsightList items={activeTier.features} />
                </div>
                <div>
                  <div className="cyber-section-title">Best for</div>
                  <InsightList items={activeTier.details} />
                </div>
              </div>

              <div className="cyber-pill-row">
                <button type="button" className="cyber-button">
                  {activeTier.cta}
                </button>
              </div>
            </div>
            <div className="cyber-holo-line" />
          </div>
        </div>
      ) : null}
    </main>
  );
}
