import styles from './HeroText.module.css';

interface HeroTextProps {
  onEnterUniverse: () => void;
}

/**
 * HeroText — the monumental centrepiece of the landing view.
 * Contains the main h1, tagline, body copy, and pill CTAs.
 */
export function HeroText({ onEnterUniverse }: HeroTextProps) {
  return (
    <div className={styles.container}>
      {/* Identity pill */}
      <div
        className={styles.identityPill}
        data-magnetic=""
        data-magnetic-strength="0.25"
      >
        <span className="magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>
            adjust
          </span>
          <span className={styles.identityText}>SHIVAM S.&nbsp;</span>
        </span>
      </div>

      {/* Main headline */}
      <h1 className={styles.headline}>
        Making My Own Path
      </h1>

      {/* Tagline */}
      <p className={styles.tagline}>
        One Mind,{' '}
        <span className={styles.taglineAccent}>Infinite Direction.</span>
      </p>

      {/* Body copy */}
      <p className={styles.body}>
        A curious mind with no fixed boundaries—learning, building, questioning,
        and exploring wherever curiosity leads, while creating a path entirely my own.
      </p>

      {/* CTAs */}
      <div className={styles.ctas}>
        {/* Primary CTA — enters the Universe */}
        <button
          type="button"
          className={styles.ctaPrimary}
          data-magnetic=""
          data-magnetic-radius="130"
          data-magnetic-strength="0.45"
          onClick={onEnterUniverse}
        >
          <span className="magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>EXPLORE THE UNIVERSE</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.ctaArrow}>
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>

        {/* Secondary CTA */}
        <a
          href="#about"
          className={styles.ctaSecondary}
          data-magnetic=""
          data-magnetic-radius="120"
          data-magnetic-strength="0.42"
        >
          <span className="magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>terminal</span>
            <span>MY JOURNEY</span>
          </span>
        </a>
      </div>
    </div>
  );
}
