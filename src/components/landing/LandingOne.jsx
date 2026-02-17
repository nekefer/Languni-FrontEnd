import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import s from "../../styles/LandingOne.module.css";

export default function LandingOne() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={s.landing}>
      {/* ===== HEADER ===== */}
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
        <div className={s.headerInner}>
          <a href="/1" className={s.logo}>
            Lingu<span className={s.logoAccent}>ini</span>
          </a>
          <nav className={s.nav}>
            <a href="#home" className={`${s.navLink} ${s.navLinkActive}`}>Home</a>
            <a href="#features" className={s.navLink}>Features</a>
            <a href="#pricing" className={s.navLink}>Pricing</a>
            <a href="#about" className={s.navLink}>About</a>
          </nav>
          <button
            onClick={() => navigate({ to: "/login" })}
            className={s.signInBtn}
          >
            Sign in
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={s.hero} id="home">
        <div className={s.heroContent}>
          <h1 className={s.heroTitle}>
            Learn languages from real<br />YouTube videos, not textbooks
          </h1>
          <p className={s.heroSubtitle}>
            Linguini matches trending YouTube videos to your proficiency level.
            Click any word in the subtitles to instantly learn it — master
            English, Spanish, or French through content you actually enjoy.
          </p>
          <button
            onClick={() => navigate({ to: "/register" })}
            className={s.ctaBtn}
          >
            Start Learning Free
          </button>
          <p className={s.noCreditCard}>No Credit Card Required</p>
        </div>

        <div className={s.heroMockup}>
          {/* Notification stack */}
          <div className={s.notifStack}>
            <div className={s.notifCard}>
              <div className={s.notifDot} style={{ background: "#2AB090" }} />
              <div>
                <strong>New word saved</strong>
                <p>"bonito" added to your vocabulary</p>
              </div>
              <span className={s.notifTime}>1m ago</span>
            </div>
            <div className={s.notifCard}>
              <div className={s.notifDot} style={{ background: "#f59e0b" }} />
              <div>
                <strong>5-day streak!</strong>
                <p>Keep watching to maintain it</p>
              </div>
              <span className={s.notifTime}>2m ago</span>
            </div>
            <div className={s.notifCard}>
              <div className={s.notifDot} style={{ background: "#8b5cf6" }} />
              <div>
                <strong>Level up!</strong>
                <p>You're now Intermediate</p>
              </div>
              <span className={s.notifTime}>5m ago</span>
            </div>
          </div>

          {/* Laptop */}
          <div className={s.laptop}>
            <div className={s.laptopScreen}>
              <div className={s.browserChrome}>
                <span className={`${s.chromeDot} ${s.dotRed}`} />
                <span className={`${s.chromeDot} ${s.dotYellow}`} />
                <span className={`${s.chromeDot} ${s.dotGreen}`} />
              </div>
              <div className={s.appScreen}>
                <div className={s.videoArea}>
                  <div className={s.videoPlaceholder}>
                    <div className={s.playBtn}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                        <polygon points="5,3 17,10 5,17" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={s.captionArea}>
                  <p className={s.captionText}>
                    Ella tiene un gato muy{" "}
                    <span className={s.highlightWord}>bonito</span> en su casa
                  </p>
                </div>
              </div>
            </div>
            <div className={s.laptopBase}>
              <div className={s.laptopNotch} />
            </div>
          </div>

          {/* Phone */}
          <div className={s.phone}>
            <div className={s.phoneNotch} />
            <div className={s.phoneScreen}>
              <div className={s.vocabCard}>
                <h4 className={s.vocabWord}>bonito</h4>
                <p className={s.vocabPron}>/bo.ˈni.to/</p>
                <div className={s.vocabDivider} />
                <p className={s.vocabTrans}>beautiful, pretty</p>
                <p className={s.vocabExample}>"El gato es muy bonito"</p>
                <div className={s.vocabSaveBtn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                    <polyline points="2,7 6,11 12,3" strokeWidth="2" stroke="white" fill="none" />
                  </svg>
                  Saved
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className={s.problem} id="features">
        <div className={s.sectionInner}>
          <span className={s.sectionLabel}>PROBLEM</span>
          <h2 className={s.sectionTitle}>
            Too much time wasted on boring<br />language exercises?
          </h2>
          <p className={s.sectionSub}>
            No more artificial content. Learn from real videos people actually
            watch.
          </p>

          <div className={s.comparison}>
            {/* Without */}
            <div className={s.withoutSide}>
              <h3 className={s.compTitle}>
                Without <span className={s.compBrand}>Linguini</span>
              </h3>
              <ul className={s.painList}>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Memorizing words from static flashcard decks
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Watching videos you can't understand
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Boring textbook dialogues nobody speaks
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  No context for the words you learn
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Subtitles you can only read, not interact with
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Generic content not matched to your level
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Forgetting new words within a week
                </li>
                <li>
                  <span className={s.xIcon}>&#10005;</span>
                  Expensive tutors with limited availability
                </li>
              </ul>
            </div>

            {/* With */}
            <div className={s.withSide}>
              <h3 className={s.compTitle}>
                With <span className={s.compBrand}>Linguini</span>
              </h3>
              <div className={s.solutionCards}>
                <div className={`${s.solCard} ${s.solCard1}`}>
                  <span className={s.checkIcon}>&#10003;</span>
                  <div>
                    <strong>Real YouTube content</strong>
                    <p>Watch trending videos matched to your level</p>
                  </div>
                </div>
                <div className={`${s.solCard} ${s.solCard2}`}>
                  <span className={s.checkIcon}>&#10003;</span>
                  <div>
                    <strong>Interactive subtitles</strong>
                    <p>Click any word to learn it instantly</p>
                  </div>
                </div>
                <div className={`${s.solCard} ${s.solCard3}`}>
                  <span className={s.checkIcon}>&#10003;</span>
                  <div>
                    <strong>Instant translations</strong>
                    <p>Get definitions and context in real-time</p>
                  </div>
                </div>
                <div className={`${s.solCard} ${s.solCard4}`}>
                  <span className={s.checkIcon}>&#10003;</span>
                  <div>
                    <strong>Personal vocabulary</strong>
                    <p>Build and track your word collection</p>
                  </div>
                </div>
                <div className={`${s.solCard} ${s.solCard5}`}>
                  <span className={s.checkIcon}>&#10003;</span>
                  <div>
                    <strong>Level-matched learning</strong>
                    <p>Content tailored to your proficiency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className={s.benefits}>
        <div className={s.sectionInner}>
          <span className={s.sectionLabel}>BENEFITS</span>
          <h2 className={s.sectionTitle}>
            Master languages through content<br />you actually enjoy
          </h2>
          <p className={s.sectionSub}>
            From video discovery to vocabulary mastery, Linguini guides you every
            step with real content that keeps you engaged.
          </p>

          <div className={s.benefitGrid}>
            {/* Card 1 */}
            <div className={s.benefitCard}>
              <h3 className={s.benefitTitle}>
                Click any word to learn it instantly
              </h3>
              <p className={s.benefitDesc}>
                Watch YouTube videos with fully interactive subtitles. Hover over
                any word to see it highlighted, click to get instant definitions,
                translations, and pronunciation. Save words to build your
                personal vocabulary.
              </p>
              <div className={s.benefitMockup}>
                <div className={s.mockSubtitle}>
                  <span>Ella tiene un gato muy </span>
                  <span className={s.mockHL}>
                    bonito
                    <div className={s.mockPopup}>
                      <strong>bonito</strong>
                      <span>adj. beautiful, pretty</span>
                      <span className={s.mockSave}>+ Save word</span>
                    </div>
                  </span>
                  <span> en casa</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={s.benefitCard}>
              <h3 className={s.benefitTitle}>
                Content perfectly matched to your level
              </h3>
              <p className={s.benefitDesc}>
                Tell us your proficiency level and interests during onboarding.
                Linguini finds trending videos perfect for where you are —
                whether you're just starting or polishing advanced skills.
              </p>
              <div className={s.benefitMockup}>
                <div className={s.mockNotif}>
                  <div className={s.mockNotifIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2AB090" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polygon points="10,9 16,12 10,15" fill="#2AB090" stroke="none" />
                    </svg>
                  </div>
                  <div className={s.mockNotifBody}>
                    <strong>New video for you</strong>
                    <p>
                      A trending video in Spanish matches your Intermediate level
                    </p>
                  </div>
                  <span className={s.mockNotifTime}>1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className={s.pricing} id="pricing">
        <div className={s.sectionInner}>
          <h2 className={s.pricingTitle}>Pricing plans</h2>

          <div className={s.pricingGrid}>
            {/* Free */}
            <div className={s.priceCard}>
              <h3 className={s.planName}>Free</h3>
              <div className={s.planPrice}>$0</div>
              <ul className={s.planFeats}>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> 5 videos per day
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Basic subtitle display
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>10</strong> word saves per day
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Community support
                </li>
                <li className={s.featNo}>
                  <span className={s.xk}>&#10005;</span> Context-aware
                  translations
                </li>
                <li className={s.featNo}>
                  <span className={s.xk}>&#10005;</span> Advanced vocabulary
                  tools
                </li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.planBtnOutline}
              >
                Start free plan
              </button>
            </div>

            {/* Pro */}
            <div className={`${s.priceCard} ${s.priceCardHL}`}>
              <h3 className={s.planName}>Pro</h3>
              <div className={s.planPriceRow}>
                <span className={s.planPrice}>$6</span>
                <span className={s.planPeriod}>/mo</span>
                <span className={s.planYearly}>or $48 /yr</span>
              </div>
              <ul className={s.planFeats}>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>Unlimited</strong> video access
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>Interactive</strong> clickable subtitles
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>Unlimited</strong> word saves
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Context-aware
                  translations
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Export vocabulary lists
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> 2 language pairs
                </li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.planBtnFilled}
              >
                See Pro plan
              </button>
            </div>

            {/* Premium */}
            <div className={`${s.priceCard} ${s.priceCardHL}`}>
              <div className={s.planBadge}>NEW</div>
              <h3 className={s.planName}>Premium</h3>
              <div className={s.planPriceRow}>
                <span className={s.planPrice}>$15</span>
                <span className={s.planPeriod}>/mo</span>
                <span className={s.planYearly}>or $120 /yr</span>
              </div>
              <ul className={s.planFeats}>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>Everything</strong> from Pro
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span>{" "}
                  <strong>AI-powered</strong> explanations
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Advanced vocabulary
                  analytics
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> All 3 languages
                  (EN/ES/FR)
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Priority support
                </li>
                <li className={s.featYes}>
                  <span className={s.ck}>&#10003;</span> Early access to new
                  features
                </li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.planBtnFilled}
              >
                See Premium plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={s.footer} id="about">
        <div className={s.footerInner}>
          <div className={s.footerBrand}>
            <a href="/1" className={s.footerLogo}>
              Lingu<span className={s.logoAccent}>ini</span>
            </a>
            <p className={s.footerTagline}>
              Learn languages from real content.
            </p>
          </div>

          <div className={s.footerSocial}>
            <p className={s.footerSocialLabel}>Connect with us</p>
            <div className={s.socialRow}>
              <a href="#" className={s.socialLink} aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className={s.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div className={s.footerCol}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#">How it works</a>
            <a href="#">Languages</a>
          </div>

          <div className={s.footerCol}>
            <h4>Resources</h4>
            <a href="#">Help Center</a>
            <a href="#">Blog</a>
            <a href="#">Tutorials</a>
            <a href="#">Contact</a>
          </div>
        </div>

        <div className={s.footerBottom}>
          <span>Linguini 2026</span>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
