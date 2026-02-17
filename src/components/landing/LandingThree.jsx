import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import s from "../../styles/LandingThree.module.css";

export default function LandingThree() {
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
          <a href="/3" className={s.logo}>
            <span className={s.logoEmoji}>&#127837;</span>
            linguini
          </a>
          <nav className={s.nav}>
            <a href="#home" className={s.navLink}>Home</a>
            <a href="#features" className={s.navLink}>Features</a>
            <a href="#pricing" className={s.navLink}>Pricing</a>
            <a href="#about" className={s.navLink}>About</a>
          </nav>
          <div className={s.headerBtns}>
            <button
              onClick={() => navigate({ to: "/login" })}
              className={s.loginBtn}
            >
              Log in
            </button>
            <button
              onClick={() => navigate({ to: "/register" })}
              className={s.tryBtn}
            >
              Try free
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className={s.hero} id="home">
        <div className={s.heroBlob1} />
        <div className={s.heroBlob2} />
        <div className={s.heroContent}>
          <div className={s.heroPill}>
            <span>&#127468;&#127463;</span>
            <span>&#127466;&#127480;</span>
            <span>&#127467;&#127479;</span>
            English, Spanish & French
          </div>
          <h1 className={s.heroTitle}>
            Watch YouTube.
            <br />
            <span className={s.heroHighlight}>Learn a language.</span>
          </h1>
          <p className={s.heroSub}>
            Turn every YouTube video into an interactive language lesson.
            Click words in subtitles, build vocabulary, and learn at your own pace
            with content you actually enjoy watching.
          </p>
          <div className={s.heroActions}>
            <button
              onClick={() => navigate({ to: "/register" })}
              className={s.heroBtn}
            >
              Start learning — it's free
            </button>
            <p className={s.heroNote}>No credit card needed. Free forever plan available.</p>
          </div>
        </div>

        {/* Bento preview */}
        <div className={s.bentoPreview}>
          <div className={s.bentoVideo}>
            <div className={s.bentoVideoInner}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="rgba(196,93,62,0.15)" />
                <polygon points="16,12 30,20 16,28" fill="#c45d3e" />
              </svg>
              <p className={s.bentoVideoLabel}>Interactive Video Player</p>
            </div>
          </div>
          <div className={s.bentoCaptions}>
            <p className={s.bentoCapTitle}>Live Subtitles</p>
            <div className={s.bentoCapLine}>
              <span>La </span>
              <span className={s.bentoCapWord}>primavera</span>
              <span> es mi estacion favorita</span>
            </div>
            <div className={s.bentoCapPopup}>
              <strong>primavera</strong>
              <span>spring (season)</span>
            </div>
          </div>
          <div className={s.bentoVocab}>
            <p className={s.bentoVocabTitle}>Your Vocabulary</p>
            <div className={s.bentoVocabList}>
              <div className={s.bentoWordItem}>
                <span className={s.bentoWordDot} style={{ background: '#c45d3e' }} />
                <span>hermosa</span>
                <span className={s.bentoWordDef}>beautiful</span>
              </div>
              <div className={s.bentoWordItem}>
                <span className={s.bentoWordDot} style={{ background: '#7d9b76' }} />
                <span>primavera</span>
                <span className={s.bentoWordDef}>spring</span>
              </div>
              <div className={s.bentoWordItem}>
                <span className={s.bentoWordDot} style={{ background: '#e5a100' }} />
                <span>aprender</span>
                <span className={s.bentoWordDef}>to learn</span>
              </div>
            </div>
          </div>
          <div className={s.bentoStats}>
            <div className={s.bentoStat}>
              <span className={s.bentoStatNum}>47</span>
              <span className={s.bentoStatLabel}>Words saved</span>
            </div>
            <div className={s.bentoStat}>
              <span className={s.bentoStatNum}>5</span>
              <span className={s.bentoStatLabel}>Day streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider */}
      <div className={s.waveDivider}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#faf5eb" />
        </svg>
      </div>

      {/* ===== PROBLEM ===== */}
      <section className={s.problem} id="features">
        <div className={s.sectionInner}>
          <div className={s.sectionBadge}>THE STRUGGLE</div>
          <h2 className={s.sectionTitle}>
            Sound familiar?
          </h2>
          <p className={s.sectionSub}>
            Most language learners face the same frustrations. You don't have to.
          </p>

          <div className={s.struggleGrid}>
            <div className={s.struggleCard}>
              <span className={s.struggleIcon}>&#128164;</span>
              <h3>Boring content</h3>
              <p>Textbook exercises put you to sleep. You need content that makes you forget you're learning.</p>
            </div>
            <div className={s.struggleCard}>
              <span className={s.struggleIcon}>&#128557;</span>
              <h3>Words that don't stick</h3>
              <p>You memorize a word and forget it by dinner. Without context, your brain just won't hold on.</p>
            </div>
            <div className={s.struggleCard}>
              <span className={s.struggleIcon}>&#128566;</span>
              <h3>Too hard or too easy</h3>
              <p>Content is either so basic it's useless, or so advanced you can't follow along.</p>
            </div>
            <div className={s.struggleCard}>
              <span className={s.struggleIcon}>&#128176;</span>
              <h3>Expensive tools</h3>
              <p>Tutors cost a fortune and apps charge premium prices for features you barely use.</p>
            </div>
          </div>

          <div className={s.arrowDown}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#c45d3e" strokeWidth="2.5">
              <path d="M20 8v24M12 24l8 8 8-8" />
            </svg>
          </div>

          <div className={s.solutionBanner}>
            <h3>Linguini fixes all of this.</h3>
            <p>Real YouTube videos. Interactive subtitles. Vocabulary that sticks.</p>
          </div>
        </div>
      </section>

      {/* Wave divider 2 */}
      <div className={s.waveDivider2}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>

      {/* ===== BENEFITS ===== */}
      <section className={s.benefits}>
        <div className={s.sectionInner}>
          <div className={s.sectionBadge}>HOW IT WORKS</div>
          <h2 className={s.sectionTitle}>
            Learning that feels like watching TV
          </h2>
          <p className={s.sectionSub}>
            Three simple steps to fluency through content you love.
          </p>

          <div className={s.stepsGrid}>
            <div className={s.stepCard}>
              <div className={s.stepNumber}>1</div>
              <h3>Pick a video</h3>
              <p>Browse trending YouTube videos matched to your language and proficiency level. Music, vlogs, news — whatever you enjoy.</p>
              <div className={s.stepVisual}>
                <div className={s.stepThumb} />
                <div className={s.stepThumb} />
                <div className={s.stepThumb} />
              </div>
            </div>
            <div className={s.stepCard}>
              <div className={s.stepNumber}>2</div>
              <h3>Click any word</h3>
              <p>As the video plays, subtitles appear in sync. Click any word you don't know for an instant definition and translation.</p>
              <div className={s.stepVisualAlt}>
                <div className={s.stepCaption}>
                  <span>La vida es </span>
                  <span className={s.stepHL}>bella</span>
                </div>
              </div>
            </div>
            <div className={s.stepCard}>
              <div className={s.stepNumber}>3</div>
              <h3>Build vocabulary</h3>
              <p>Save words to your personal collection. Review them anytime with real context from the videos you watched.</p>
              <div className={s.stepVisualAlt}>
                <div className={s.stepWordBubble}>bella</div>
                <div className={s.stepWordBubble}>hermosa</div>
                <div className={s.stepWordBubble}>vida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className={s.pricing} id="pricing">
        <div className={s.blobPricing} />
        <div className={s.sectionInner}>
          <div className={s.sectionBadge}>PRICING</div>
          <h2 className={s.sectionTitle}>Simple, honest pricing</h2>
          <p className={s.sectionSub}>
            Start for free. Upgrade when you're hooked.
          </p>

          <div className={s.priceGrid}>
            {/* Free */}
            <div className={s.priceCard}>
              <div className={s.priceEmoji}>&#127793;</div>
              <h3 className={s.pName}>Starter</h3>
              <div className={s.pPrice}>Free</div>
              <p className={s.pTagline}>Dip your toes in</p>
              <ul className={s.pList}>
                <li>5 videos per day</li>
                <li>Basic subtitles</li>
                <li>10 word saves/day</li>
                <li>Community support</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.pBtnLight}
              >
                Get started
              </button>
            </div>

            {/* Pro */}
            <div className={`${s.priceCard} ${s.priceCardFeatured}`}>
              <div className={s.featuredTag}>Best value</div>
              <div className={s.priceEmoji}>&#127775;</div>
              <h3 className={s.pName}>Pro</h3>
              <div className={s.pPrice}>
                $6<span className={s.pMo}>/mo</span>
              </div>
              <p className={s.pTagline}>or $48/year (save 33%)</p>
              <ul className={s.pList}>
                <li>Unlimited videos</li>
                <li>Interactive subtitles</li>
                <li>Unlimited saves</li>
                <li>Translations</li>
                <li>Export vocabulary</li>
                <li>2 language pairs</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.pBtnWarm}
              >
                Start Pro
              </button>
            </div>

            {/* Premium */}
            <div className={s.priceCard}>
              <div className={s.priceEmoji}>&#128142;</div>
              <h3 className={s.pName}>Premium</h3>
              <div className={s.pPrice}>
                $15<span className={s.pMo}>/mo</span>
              </div>
              <p className={s.pTagline}>or $120/year (save 33%)</p>
              <ul className={s.pList}>
                <li>Everything in Pro</li>
                <li>AI explanations</li>
                <li>Vocabulary analytics</li>
                <li>All 3 languages</li>
                <li>Priority support</li>
                <li>Early access</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/register" })}
                className={s.pBtnLight}
              >
                Start Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={s.footer} id="about">
        <div className={s.footerWave}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#2d1b3d" />
          </svg>
        </div>
        <div className={s.footerBody}>
          <div className={s.footerInner}>
            <div className={s.footerBrand}>
              <a href="/3" className={s.footerLogo}>
                <span>&#127837;</span> linguini
              </a>
              <p className={s.footerDesc}>
                Learn languages through real YouTube videos and interactive subtitles.
              </p>
            </div>

            <div className={s.footerCol}>
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">How it works</a>
            </div>

            <div className={s.footerCol}>
              <h4>Company</h4>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">About</a>
            </div>

            <div className={s.footerCol}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>

          <div className={s.footerBottom}>
            <span>&copy; 2026 Linguini. Made with &#10084;&#65039; for language learners.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
