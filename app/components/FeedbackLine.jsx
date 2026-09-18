"use client";
import { useState } from "react";

const SCALE = [
  { value: 1, label: "Very bad" },
  { value: 2, label: "Not satisfying" },
  { value: 3, label: "Needs improvement" },
  { value: 4, label: "Good" },
  { value: 5, label: "Exceptional" },
];

export default function FeedbackLine({ generationId, initialSubmitted = false }) {
  const [rating, setRating] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [sending, setSending] = useState(false);

  const activeLabel = SCALE.find((s) => s.value === (hovered ?? rating))?.label;

 const handleSubmit = async () => {
    if (!rating) return;
    setSending(true);

    try {
      const response = await fetch(`/api/generate/${generationId}/feedback`, { // Update this URL if needed
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackRating: rating,
          feedbackText: comment,
        }),
      });

      // 1. Check if the response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textError = await response.text();
        console.error("API returned HTML instead of JSON. Route might be 404ing.", textError);
        setSending(false);
        return;
      }

      // 2. Safe to parse now
      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit:", result.error);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setRating(null);
    setComment("");
  };

  return (
    <div style={styles.wrap}>
      <style>{css}</style>

      {submitted ? (
        <div className="fl-line fl-line--done">
          <span className="fl-check" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="fl-done-text">
            Thank you — your feedback was recorded.
          </span>
        </div>
      ) : (
        <div className="fl-card">
          <div className="fl-header">
            <h2 className="fl-title">How was your experience?</h2>
            <p className="fl-sub">Your rating helps us improve future generations.</p>
          </div>

          <div className="fl-scale" role="radiogroup" aria-label="Rating">
            <div className="fl-track" aria-hidden="true" />
            {SCALE.map((s) => {
              const isSelected = rating === s.value;
              const isHovered = hovered === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${s.value} — ${s.label}`}
                  className={`fl-node${isSelected ? " fl-node--selected" : ""}${
                    isHovered && !isSelected ? " fl-node--hover" : ""
                  }`}
                  onMouseEnter={() => setHovered(s.value)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(s.value)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setRating(s.value)}
                >
                  {s.value}
                </button>
              );
            })}
          </div>

          <div className="fl-label-row" aria-live="polite">
            <span className={`fl-label${activeLabel ? " fl-label--visible" : ""}`}>
              {activeLabel || "Select a rating"}
            </span>
          </div>

          <div className={`fl-reveal${rating ? " fl-reveal--open" : ""}`}>
            <div className="fl-reveal-inner">
              <label className="fl-field-label" htmlFor="fl-comment">
                Anything you'd like to add? <span className="fl-optional">optional</span>
              </label>
              <textarea
                id="fl-comment"
                className="fl-textarea"
                placeholder="Tell us what stood out, or what we could do better…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />

              <div className="fl-actions">
                <button className="fl-textlink" type="button" onClick={handleReset}>
                  Clear
                </button>
                <button
                  className="fl-submit"
                  type="button"
                  disabled={!rating || sending}
                  onClick={handleSubmit}
                >
                  {sending ? "Sending…" : "Submit feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "24px 0px",
  },
};

const css = `
:root {
  --fl-ink: #f8fafc;
  --fl-panel: #ffffff;
  --fl-panel-2: #f8fafc;
  --fl-border: #e2e8f0;
  --fl-border-soft: #f1f5f9;
  --fl-hi: #0f172a;
  --fl-lo: #64748b;
  --fl-lo-2: #94a3b8;
  --fl-brass: #6366f1; 
  --fl-brass-soft: #e0e7ff;
  --fl-brass-line: #818cf8;
  --fl-shadow: rgba(0,0,0,0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --fl-ink: #020617;
    --fl-panel: #0f172a;
    --fl-panel-2: #1e293b;
    --fl-border: #334155;
    --fl-border-soft: #1e293b;
    --fl-hi: #f8fafc;
    --fl-lo: #94a3b8;
    --fl-lo-2: #64748b;
    --fl-brass: #818cf8; 
    --fl-brass-soft: rgba(99, 102, 241, 0.15);
    --fl-brass-line: #6366f1;
    --fl-shadow: rgba(0,0,0,0.4);
  }
}

.fl-card {
  width: 100%;
  max-width: 500px;
  background: var(--fl-panel);
  border: 1px solid var(--fl-border);
  border-radius: 20px;
  padding: 28px 26px 24px;
  box-shadow: 0 10px 40px -10px var(--fl-shadow);
  font-family: inherit;
}

.fl-header { margin-bottom: 22px; text-align: center; }

.fl-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: var(--fl-hi);
}

.fl-sub {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--fl-lo);
}

.fl-scale {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 2px 10px;
  padding: 0 2px;
}

.fl-track {
  position: absolute;
  left: 18px;
  right: 18px;
  top: 50%;
  height: 2px;
  background: var(--fl-border-soft);
  transform: translateY(-50%);
  z-index: 0;
}

.fl-node {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--fl-border);
  background: var(--fl-panel);
  color: var(--fl-lo);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease, border-color 160ms ease, color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.fl-node:hover { color: var(--fl-hi); }

.fl-node--hover {
  border-color: var(--fl-brass-line);
  transform: translateY(-1px);
}

.fl-node--selected {
  background: var(--fl-brass);
  border-color: var(--fl-brass);
  color: #ffffff;
  transform: scale(1.12);
  box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.55);
}

.fl-node:focus-visible {
  outline: 2px solid var(--fl-brass);
  outline-offset: 2px;
}

.fl-label-row {
  min-height: 20px;
  text-align: center;
  margin-bottom: 4px;
}

.fl-label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--fl-lo-2);
  letter-spacing: 0.2px;
  opacity: 0.7;
  transition: opacity 160ms ease, color 160ms ease;
}

.fl-label--visible {
  color: var(--fl-brass);
  opacity: 1;
}

.fl-reveal {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 320ms ease, opacity 280ms ease;
}

.fl-reveal--open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.fl-reveal-inner {
  overflow: hidden;
  min-height: 0;
}

.fl-field-label {
  display: block;
  margin-top: 18px;
  margin-bottom: 8px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--fl-lo);
}

.fl-optional {
  color: var(--fl-lo-2);
  font-size: 11.5px;
  font-weight: normal;
}

.fl-textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 64px;
  background: var(--fl-panel-2);
  border: 1px solid var(--fl-border);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--fl-hi);
  font-size: 13.5px;
  line-height: 1.5;
  font-family: inherit;
  transition: border-color 160ms ease;
}

.fl-textarea::placeholder { color: var(--fl-lo-2); }

.fl-textarea:focus {
  outline: none;
  border-color: var(--fl-brass-line);
}

.fl-actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.fl-textlink {
  background: none;
  border: none;
  padding: 0;
  color: var(--fl-lo);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 140ms ease;
}

.fl-textlink:hover { color: var(--fl-hi); }

.fl-submit {
  background: var(--fl-hi);
  color: var(--fl-panel);
  border: none;
  border-radius: 10px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 140ms ease, transform 140ms ease, box-shadow 140ms ease;
}

.fl-submit:hover:not(:disabled) { 
  opacity: 0.9;
  transform: translateY(-1px); 
  box-shadow: 0 4px 12px -4px rgba(0,0,0,0.2);
}

.fl-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.fl-line {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--fl-panel);
  border: 1px solid var(--fl-border);
  border-radius: 999px;
  padding: 12px 18px;
  box-shadow: 0 4px 12px -6px var(--fl-shadow);
  font-family: inherit;
}

.fl-check {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--fl-brass-soft);
  color: var(--fl-brass);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fl-done-text {
  flex: 1 1 auto;
  font-size: 13px;
  font-weight: 500;
  color: var(--fl-hi);
}
`;