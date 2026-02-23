import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import s from "../styles/Welcome.module.css";

export default function Welcome() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={s.page}>
      {/* ===== HEADER ===== */}
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
        <div className={s.headerInner}>
          <a href="/" className={s.logo}>
            Lingu<span className={s.logoAcc}>ini</span>
          </a>
          <nav className={s.nav}>
            <a href="#hero" className={s.navLink}>Home</a>
            <a href="#problem" className={s.navLink}>Why Linguini</a>
            <a href="#benefits" className={s.navLink}>Features</a>
            <a href="#pricing" className={s.navLink}>Pricing</a>
          </nav>
          <div className={s.headerRight}>
            <button onClick={() => navigate({ to: "/login" })} className={s.loginBtn}>
              Log in
            </button>
            <button onClick={() => navigate({ to: "/register" })} className={s.startBtn}>
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO — Split Layout ===== */}
      <section className={s.hero} id="hero">
        <div className={s.heroInner}>
          <div className={s.heroLeft}>
            <div className={s.heroLabel}>
              <span className={s.heroDot} />
              Language learning, reimagined
            </div>
            <h1 className={s.heroH1}>
              Stop studying.
              <br />
              <span className={s.heroEm}>Start watching.</span>
            </h1>
            <p className={s.heroP}>
              Pick a YouTube video in Spanish, French, or English. We add
              clickable subtitles. Don't know a word? Tap it. Definition,
              translation, context — instantly. That's how Linguini works.
            </p>
            <div className={s.heroCtas}>
              <button onClick={() => navigate({ to: "/register" })} className={s.ctaPrimary}>
                Start learning free
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9h10M10 5l4 4-4 4" />
                </svg>
              </button>
              <span className={s.ctaNote}>Free forever. No credit card.</span>
            </div>
            <div className={s.heroStats}>
              <div className={s.stat}>
                <span className={s.statNum}>3</span>
                <span className={s.statLabel}>Languages</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statNum}>&#8734;</span>
                <span className={s.statLabel}>YouTube videos</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statNum}>1-click</span>
                <span className={s.statLabel}>Word lookup</span>
              </div>
            </div>
          </div>

          <div className={s.heroRight}>
            <div className={s.heroCard}>
              <div className={s.hcHeader}>
                <span className={s.hcDot} style={{ background: '#ff5f57' }} />
                <span className={s.hcDot} style={{ background: '#ffbd2e' }} />
                <span className={s.hcDot} style={{ background: '#28c841' }} />
                <span className={s.hcUrl}>linguini.app/player</span>
              </div>
              <div className={s.hcBody}>
                <div className={s.hcVideo}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="rgba(42,176,144,0.12)" />
                    <polygon points="13,10 23,16 13,22" fill="#2AB090" />
                  </svg>
                </div>
                <div className={s.hcCaptions}>
                  <div className={s.hcCapLine}>
                    <span className={s.hcTime}>1:24</span>
                    El mundo es un lugar{" "}
                    <span className={s.hcHL}>increible</span> para explorar
                  </div>
                  <div className={`${s.hcCapLine} ${s.hcCapActive}`}>
                    <span className={s.hcTime}>1:27</span>
                    Cada{" "}
                    <span className={s.hcHL}>idioma</span> abre una nueva puerta
                  </div>
                </div>
                <div className={s.hcPopup}>
                  <div className={s.hcPopupWord}>idioma</div>
                  <div className={s.hcPopupDef}>language (noun)</div>
                  <div className={s.hcPopupCtx}>"Cada idioma abre una nueva puerta"</div>
                  <div className={s.hcPopupBtn}>+ Save to vocabulary</div>
                </div>
              </div>
            </div>
            <div className={s.heroAccent} />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM — Numbered Editorial ===== */}
      <section className={s.problem} id="problem">
        <div className={s.sectionInner}>
          <div className={s.problemHeader}>
            <span className={s.tag}>The problem</span>
            <h2 className={s.sectionH2}>
              Why most language apps<br />leave you stuck.
            </h2>
          </div>

          <div className={s.problemGrid}>
            <div className={s.problemItem}>
              <span className={s.problemNum}>01</span>
              <h3>No real context</h3>
              <p>
                Flashcard apps drill vocabulary without context. You memorize
                words in isolation and forget them within days because your brain
                has nothing to anchor them to.
              </p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>02</span>
              <h3>Artificial content</h3>
              <p>
                Textbook dialogues feel scripted because they are. Nobody talks
                like that. Real conversations use slang, idioms, and natural
                pacing that scripted lessons ignore.
              </p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>03</span>
              <h3>Wrong difficulty</h3>
              <p>
                Content is either too basic to be useful or too advanced to
                follow. Without proper level matching, you're stuck in a cycle
                of frustration or boredom.
              </p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>04</span>
              <h3>Passive subtitles</h3>
              <p>
                Regular subtitles are read-only. You see unknown words fly by
                and can't pause to look them up without breaking your flow
                and losing the moment.
              </p>
            </div>
          </div>

          <div className={s.problemSolution}>
            <div className={s.solLine} />
            <p className={s.solText}>
              Linguini solves every one of these problems with one simple idea:
              <strong> learn from the videos people actually watch.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS — Tall Cards ===== */}
      <section className={s.benefits} id="benefits">
        <div className={s.sectionInner}>
          <span className={s.tag}>Features</span>
          <h2 className={s.sectionH2}>
            Everything you need.<br />Nothing you don't.
          </h2>

          <div className={s.featGrid}>
            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="22" height="14" rx="3" />
                  <polygon points="11,9 19,12 11,15" fill="currentColor" stroke="none" />
                  <line x1="3" y1="23" x2="25" y2="23" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Interactive Video Player</h3>
              <p>
                Watch real YouTube videos with synchronized, clickable subtitles.
                The video pauses when you click a word so you never miss a beat.
              </p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="14" cy="10" r="7" />
                  <path d="M7 24c0-4 3-7 7-7s7 3 7 7" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Instant Word Lookup</h3>
              <p>
                Click any word for definitions, pronunciation, translations, and
                real example sentences — all without leaving the video.
              </p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                </svg>
              </div>
              <h3>Level Matching</h3>
              <p>
                Tell us your proficiency during onboarding. We surface trending
                videos calibrated to challenge you without overwhelming.
              </p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="20" height="20" rx="4" />
                  <path d="M10 14h8M14 10v8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Personal Vocabulary</h3>
              <p>
                Save words with the context you found them in. Review your
                collection anytime with full definitions and video references.
              </p>
              <div className={s.featAccent} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING — Table Style ===== */}
      <section className={s.pricing} id="pricing">
        <div className={s.sectionInner}>
          <span className={s.tag}>Pricing</span>
          <h2 className={s.sectionH2}>
            Start free. Scale when ready.
          </h2>
          <p className={s.sectionP}>
            No surprises. No hidden fees. Cancel anytime.
          </p>

          <div className={s.priceGrid}>
            {/* Free */}
            <div className={s.priceCard}>
              <div className={s.priceTop}>
                <h3 className={s.pName}>Free</h3>
                <div className={s.pAmount}>$0</div>
                <p className={s.pSub}>Forever free</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>5 videos per day</li>
                <li className={s.pYes}>Basic subtitles</li>
                <li className={s.pYes}>10 word saves / day</li>
                <li className={s.pYes}>Community support</li>
                <li className={s.pNo}>Translations</li>
                <li className={s.pNo}>Vocabulary export</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnLight}>
                Get started
              </button>
            </div>

            {/* Pro */}
            <div className={`${s.priceCard} ${s.priceCardPop}`}>
              <div className={s.popTag}>Popular</div>
              <div className={s.priceTop}>
                <h3 className={s.pName}>Pro</h3>
                <div className={s.pAmount}>
                  $6<span className={s.pMo}>/mo</span>
                </div>
                <p className={s.pSub}>or $48 billed yearly</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>Unlimited videos</li>
                <li className={s.pYes}>Interactive subtitles</li>
                <li className={s.pYes}>Unlimited word saves</li>
                <li className={s.pYes}>Context translations</li>
                <li className={s.pYes}>Vocabulary export</li>
                <li className={s.pYes}>2 language pairs</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnSolid}>
                Start Pro
              </button>
            </div>

            {/* Premium */}
            <div className={s.priceCard}>
              <div className={s.priceTop}>
                <h3 className={s.pName}>Premium</h3>
                <div className={s.pAmount}>
                  $15<span className={s.pMo}>/mo</span>
                </div>
                <p className={s.pSub}>or $120 billed yearly</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>Everything in Pro</li>
                <li className={s.pYes}>AI-powered explanations</li>
                <li className={s.pYes}>Vocabulary analytics</li>
                <li className={s.pYes}>All 3 languages</li>
                <li className={s.pYes}>Priority support</li>
                <li className={s.pYes}>Early access</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnLight}>
                Start Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerTop}>
            <div className={s.footerCta}>
              <h2 className={s.footerH2}>Ready to learn from real content?</h2>
              <button onClick={() => navigate({ to: "/register" })} className={s.ctaPrimary}>
                Start learning free
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9h10M10 5l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>

          <div className={s.footerDivider} />

          <div className={s.footerBottom}>
            <a href="/" className={s.footerLogo}>
              Lingu<span className={s.logoAcc}>ini</span>
            </a>
            <div className={s.footerLinks}>
              <a href="#benefits">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
            <p className={s.footerCopy}>&copy; 2026 Linguini</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
