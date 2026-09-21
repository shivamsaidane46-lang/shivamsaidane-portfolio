import { useUniverse } from '@/context/UniverseContext';
import styles from './BlueprintModal.module.css';

// ── Helper: renders a titled section with a bullet list ─────────────────────
function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Helper: renders a titled section with a paragraph ───────────────────────
function TextSection({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <p className={styles.paragraph}>{text}</p>
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────
export function BlueprintModal() {
  const { state, closeBlueprint } = useUniverse();
  const { inspector } = state;

  if (!state.blueprintOpen || !inspector.focusedPlanet) return null;

  const p = inspector.focusedPlanet;
  const d = p.detail;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBlueprint();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-title"
    >
      <div className={styles.modal}>
        {/* ── Header ─────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerDot} />
            <h3 id="blueprint-title" className={styles.headerTitle}>
              {p.fullName ?? p.name}
            </h3>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeBlueprint}
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className={styles.body}>
          <p className={styles.subtitle}>{p.subtitle}</p>

          {/* Workflow image */}
          {p.workflowImage && (
            <div className={styles.imageWrapper}>
              <img
                src={p.workflowImage}
                alt={`${p.fullName ?? p.name} workflow diagram`}
                className={styles.workflowImage}
                loading="lazy"
                onError={(e) => {
                  // Hide broken image container gracefully
                  (e.currentTarget.parentElement as HTMLElement).style.display =
                    'none';
                }}
              />
            </div>
          )}

          {d ? (
            <>
              <TextSection title="What It Does" text={d.whatItDoes} />
              <TextSection title="Problem" text={d.problem} />
              <Section title="Workflow / Data Flow" items={d.workflowDataFlow} />
              {d.architecture && (
                <Section title="Architecture" items={d.architecture} />
              )}
              {d.techStack && (
                <Section title="Tech Stack" items={d.techStack} />
              )}
              {d.errorHandling && (
                <Section title="Error Handling" items={d.errorHandling} />
              )}
              {d.securityValidation && (
                <Section
                  title="Security & Validation"
                  items={d.securityValidation}
                />
              )}
              {d.advantages && (
                <Section title="Advantages" items={d.advantages} />
              )}
              {d.results && (
                <Section title="Results (Prototype Benchmarks)" items={d.results} />
              )}
              {d.limitations && (
                <Section
                  title="Limitations & Future Improvements"
                  items={d.limitations}
                />
              )}
            </>
          ) : (
            /* Fallback: no detail object populated yet */
            <div className={styles.comingSoon}>
              <div className={styles.comingSoonIcon}>
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <p className={styles.comingSoonTitle}>Project details coming soon</p>
                <p className={styles.comingSoonBody}>
                  Full documentation for this project will be added shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.footerNote}>Node: {p.id}</span>
          <button className={styles.doneBtn} onClick={closeBlueprint}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
