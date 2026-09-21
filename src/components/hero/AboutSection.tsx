import styles from './AboutSection.module.css';

const EMAILS = [
  {
    address: 'hello@shivamsaidane.online',
    label: 'General Inquiries',
    desc: 'Questions, ideas, or just want to say hello.',
    icon: 'forum',
  },
  {
    address: 'shivam@shivamsaidane.online',
    label: 'Professional Contact',
    desc: 'Collaboration, partnerships, or formal outreach.',
    icon: 'badge',
  },
  {
    address: 'work@shivamsaidane.online',
    label: 'Freelance \u0026 Projects',
    desc: 'Hiring for a project, freelance scope, or brief.',
    icon: 'work',
  },
] as const;

const PROFILES = [
  {
    id: 'fiverr',
    label: 'Fiverr',
    url: 'https://www.fiverr.com/s/Q27aQyp',
    desc: 'Browse services \u0026 commission work',
    icon: 'storefront',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shivam-saidane-82b11b274/',
    desc: 'Professional profile \u0026 background',
    icon: 'person_pin',
  },
] as const;

/**
 * AboutSection — the personal manifesto / polymath journey section.
 * Anchored at id="about" so the "MY JOURNEY" CTA scrolls here.
 * Content is verbatim from the provided brief — no invented details.
 */
export function AboutSection() {
  return (
    <>
      <section id="about" className={styles.section}>
      {/* Subtle top divider + scanline */}
      <div className={styles.divider} />

      <div className={styles.container}>

        {/* ── Opening ────────────────────────────────────────── */}
        <div className={styles.opening}>
          <p className={styles.badge}>// ABOUT</p>
          <h2 className={styles.heading}>Shivam S.</h2>
          <p className={styles.lead}>
            I'm a self-taught builder, curious learner, and aspiring polymath exploring
            the intersection of technology, creativity, and problem-solving.
          </p>
          <p className={styles.body}>
            My path hasn't followed a conventional route. After leaving college during my
            second year, I chose to focus on learning through doing—taking on freelance
            work across different areas including data entry, website building, voice models,
            editing, AI automation, and other digital projects. Each project introduced me
            to a different way of thinking, building, and solving problems.
          </p>
          <p className={styles.body}>
            Over time, I realised that I didn't want to limit myself to a single skill or
            discipline. I wanted to explore many.
          </p>
        </div>

        {/* ── The Polymath Journey ────────────────────────────── */}
        <div className={styles.block}>
          <h3 className={styles.blockHeading}>THE POLYMATH JOURNEY</h3>
          <div className={styles.blockRule} />
          <p className={styles.blockQuote}>
            I see life as a limited amount of time in an almost limitless universe of
            things to learn.
          </p>
          <p className={styles.body}>
            For me, becoming the best at one thing is only one possible definition of
            greatness. My ambition is different: to continuously expand the boundaries of
            what I can understand and create.
          </p>
          <p className={styles.body}>
            I want to learn across disciplines, connect ideas that normally exist apart,
            experiment with unfamiliar fields, and turn what I learn into something tangible.
          </p>
          <p className={styles.body}>
            Not to master everything—because that would be impossible—but to keep moving
            closer to the enormous amount of knowledge that exists beyond what any one
            person could ever know.
          </p>
          <p className={styles.bodyEmphasis}>That is what being a polymath means to me.</p>
        </div>

        {/* ── What I'm Exploring ──────────────────────────────── */}
        <div className={styles.block}>
          <h3 className={styles.blockHeading}>WHAT I'M EXPLORING</h3>
          <div className={styles.blockRule} />
          <p className={styles.body}>
            My current portfolio work is focused on{' '}
            <span className={styles.accent}>AI Automation</span>, where I'm building
            practical automation systems and workflows.
          </p>
          <p className={styles.body}>At the same time, I'm expanding into:</p>
          <ul className={styles.list}>
            {[
              'Python',
              'SQL',
              'Excel',
              'BigQuery',
              'Web Development',
              'Machine Learning',
              'Marketing',
              'Japanese, Spanish & French',
            ].map((item) => (
              <li key={item} className={styles.listItem}>
                <span className={styles.listDot} />
                {item}
              </li>
            ))}
          </ul>
          <p className={styles.body}>
            Some of these are already represented through projects in my portfolio. Others
            are still being learned. As I develop them, they'll become new projects, new
            experiments, and eventually new parts of my Universe.
          </p>
        </div>

        {/* ── How I Learn ─────────────────────────────────────── */}
        <div className={styles.block}>
          <h3 className={styles.blockHeading}>HOW I LEARN</h3>
          <div className={styles.blockRule} />
          <p className={styles.body}>
            I'm largely self-taught, and I learn best by experimenting and building.
          </p>
          <p className={styles.body}>
            I don't want to simply collect skills or courses. I want to understand how
            things work, test what I've learned, make mistakes, solve problems, and turn
            knowledge into something real.
          </p>
          <p className={styles.bodyEmphasis}>
            Every skill I develop becomes another direction I can explore.
          </p>
        </div>

        {/* ── Where I'm Going ─────────────────────────────────── */}
        <div className={styles.block}>
          <h3 className={styles.blockHeading}>WHERE I'M GOING</h3>
          <div className={styles.blockRule} />
          <p className={styles.body}>I don't have a single fixed destination.</p>
          <p className={styles.body}>
            I'm building a career that can move across technology, automation, data,
            software, creativity, and whatever other fields capture my curiosity along
            the way.
          </p>
          <p className={styles.body}>The goal isn't to follow a predefined path.</p>
          <p className={styles.bodyEmphasis}>It's to build my own.</p>
        </div>

        {/* ── Bottom CTA / telemetry ───────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.footerCoords}>SECTOR // ORIGIN</span>
          <span className={styles.footerLine} />
          <span className={styles.footerCoords}>REF: SHIVAM.S // POLYMATH</span>
        </div>

      </div>
    </section>

    {/* ─────────────────────────────────────────────────────── */}
    {/* CONTACT SECTION                                        */}
    {/* ─────────────────────────────────────────────────────── */}
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactDivider} />

      <div className={styles.contactContainer}>

        {/* Header */}
        <div className={styles.contactHeader}>
          <p className={styles.badge}>// CONTACT</p>
          <h2 className={styles.contactHeading}>Let's Build Something</h2>
          <p className={styles.contactLead}>
            Open to freelance projects, collaborations, and interesting conversations.
            Reach out through any channel below.
          </p>
        </div>

        {/* Email cards */}
        <div className={styles.contactBlock}>
          <h3 className={styles.blockHeading}>EMAIL</h3>
          <div className={styles.contactBlockRule} />
          <div className={styles.emailGrid}>
            {EMAILS.map(({ address, label, desc, icon }) => (
              <a
                key={address}
                href={`mailto:${address}`}
                className={styles.emailCard}
                aria-label={`Send email to ${label}`}
              >
                <span className={styles.emailIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {icon}
                  </span>
                </span>
                <span className={styles.emailInfo}>
                  <span className={styles.emailLabel}>{label}</span>
                  <span className={styles.emailDesc}>{desc}</span>
                  <span className={styles.emailAddress}>{address}</span>
                </span>
                <span className={styles.emailArrow}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_outward</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Profile links */}
        <div className={styles.contactBlock}>
          <h3 className={styles.blockHeading}>PROFILES</h3>
          <div className={styles.contactBlockRule} />
          <div className={styles.profileGrid}>
            {PROFILES.map(({ id, label, url, desc, icon }) => (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileCard}
                aria-label={`Visit ${label} profile (opens in new tab)`}
              >
                <span className={styles.profileIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    {icon}
                  </span>
                </span>
                <span className={styles.profileInfo}>
                  <span className={styles.profileLabel}>{label}</span>
                  <span className={styles.profileDesc}>{desc}</span>
                </span>
                <span className={styles.profileArrow}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact footer bar */}
        <div className={styles.footer}>
          <span className={styles.footerCoords}>SECTOR // CONTACT</span>
          <span className={styles.footerLine} />
          <span className={styles.footerCoords}>REF: SHIVAM.S // AVAILABLE</span>
        </div>

      </div>
    </section>
    </>
  );
}
