import styles from './Navbar.module.css';

interface NavbarProps {
  soundscapeActive: boolean;
  onToggleSoundscape: () => void;
}

/**
 * Navbar — fixed frosted-glass header shared across both views.
 * All interactive elements are tagged [data-magnetic] for the
 * physics attraction engine.
 */
export function Navbar({ soundscapeActive, onToggleSoundscape }: NavbarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Wordmark */}
        <a
          href="#"
          className={styles.wordmark}
          data-magnetic=""
          data-magnetic-strength="0.22"
        >
          <span className="magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={styles.wordmarkText}>SHIVAM SAIDANE</span>
            <span className={styles.pulseDot}>
              <span className={styles.pulseDotInner} />
            </span>
          </span>
        </a>

        {/* Right: nav links + icon buttons */}
        <div className={styles.right}>
          <nav className={styles.nav}>
            <a
              href="#"
              className={`${styles.navLink} ${styles.navLinkActive}`}
              data-magnetic=""
              data-magnetic-strength="0.35"
            >
              <span className="magnetic-inner">HOME</span>
            </a>
            <a
              href="#contact"
              className={styles.navLink}
              data-magnetic=""
              data-magnetic-strength="0.35"
            >
              <span className="magnetic-inner">CONTACT</span>
            </a>
          </nav>

          <div className={styles.iconGroup}>
            {/* Soundscape toggle */}
            <button
              type="button"
              aria-label="Toggle soundscape"
              className={styles.iconBtn}
              data-magnetic=""
              data-magnetic-strength="0.45"
              onClick={onToggleSoundscape}
            >
              <span className="magnetic-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {soundscapeActive ? 'graphic_eq' : 'volume_up'}
                </span>
              </span>
            </button>

            {/* Email / inquiry */}
            <a
              href="mailto:hello@shivamsaidane.online"
              aria-label="Send a quick inquiry"
              className={styles.iconBtn}
              data-magnetic=""
              data-magnetic-strength="0.45"
            >
              <span className="magnetic-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  alternate_email
                </span>
              </span>
            </a>

            {/* Fiverr */}
            <a
              href="https://www.fiverr.com/s/Q27aQyp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fiverr profile (opens in new tab)"
              className={styles.iconBtn}
              data-magnetic=""
              data-magnetic-strength="0.45"
            >
              <span className="magnetic-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  storefront
                </span>
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/shivam-saidane-82b11b274/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
              className={styles.iconBtn}
              data-magnetic=""
              data-magnetic-strength="0.45"
            >
              <span className="magnetic-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  person_pin
                </span>
              </span>
            </a>

            {/* Avatar */}
            <div
              className={styles.avatar}
              data-magnetic=""
              data-magnetic-strength="0.38"
            >
              <span className="magnetic-inner">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--on-primary)' }}>
                  person
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
