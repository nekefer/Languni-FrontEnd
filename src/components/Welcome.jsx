import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import s from "../styles/Welcome.module.css";
import languni from "../assets/Languni.webp";
import thumbEn from "../assets/En_landing_pic.webp";
import thumbEs from "../assets/Es_landing_pic.webp";
import thumbFr from "../assets/Fr_landing_pic.webp";
import { useAuth } from "../contexts/AuthContext";
import { createCheckout } from "../api/billing";
import config from "../config";

const LANG_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

const HERO_THUMBNAIL = {
  en: thumbEn,
  es: thumbEs,
  fr: thumbFr,
};

const HERO_CARD = {
  en: {
    line1Before: "The world is an",
    line1HL: "incredible",
    line1After: "place to explore",
    line2Before: "Every",
    line2HL: "language",
    line2After: "opens a new door",
    word: "language",
    def: "language (noun)",
    ctx: '"Every language opens a new door"',
  },
  fr: {
    line1Before: "Le monde est un endroit",
    line1HL: "incroyable",
    line1After: "à explorer",
    line2Before: "Chaque",
    line2HL: "langue",
    line2After: "ouvre une nouvelle porte",
    word: "langue",
    def: "language (nom)",
    ctx: '"Chaque langue ouvre une nouvelle porte"',
  },
  es: {
    line1Before: "El mundo es un lugar",
    line1HL: "increíble",
    line1After: "para explorar",
    line2Before: "Cada",
    line2HL: "idioma",
    line2After: "abre una nueva puerta",
    word: "idioma",
    def: "language (noun)",
    ctx: '"Cada idioma abre una nueva puerta"',
  },
};

export default function Welcome() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const card = HERO_CARD[i18n.language] ?? HERO_CARD.en;
  const thumbnail = HERO_THUMBNAIL[i18n.language] ?? HERO_THUMBNAIL.en;
  const [scrolled, setScrolled] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null); // 'monthly' | 'yearly' | null

  const handleUpgrade = async (billing) => {
    if (!isAuthenticated) {
      navigate({ to: "/register" });
      return;
    }
    const variantId = billing === "yearly" ? config.lsYearlyVariantId : config.lsMonthlyVariantId;
    if (!variantId) return;
    try {
      setCheckoutLoading(billing);
      const checkoutUrl = await createCheckout(variantId);
      window.location.href = checkoutUrl;
    } catch {
      setCheckoutLoading(null);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={s.page}>
      <Helmet>
        <title>Languni — Learn Languages Through Videos</title>
        <meta name="description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation. Free to start." />
        <link rel="canonical" href="https://languni.dev/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://languni.dev/" />
        <meta property="og:title" content="Languni — Learn Languages Through Videos" />
        <meta property="og:description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation. Free to start." />
        <meta property="og:image" content="https://languni.dev/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Languni — Learn Languages Through Videos" />
        <meta name="twitter:description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation. Free to start." />
        <meta name="twitter:image" content="https://languni.dev/og-image.jpg" />
      </Helmet>
      {/* ===== HEADER ===== */}
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
        <div className={s.headerInner}>
          <a href="/" className={s.logo}>
            <img src={languni} alt="Languni" width="124" height="32" />
          </a>
          <nav className={s.nav}>
            <a href="#hero" className={s.navLink}>{t('nav.home')}</a>
            <a href="#problem" className={s.navLink}>{t('nav.whyLanguni')}</a>
            <a href="#benefits" className={s.navLink}>{t('nav.features')}</a>
            <a href="#pricing" className={s.navLink}>{t('nav.pricing')}</a>
          </nav>
          <div className={s.headerRight}>
            <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "header_login" }); navigate({ to: "/login" }); }} className={s.loginBtn}>
              {t('nav.login')}
            </button>
            <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "header_register" }); navigate({ to: "/register" }); }} className={s.startBtn}>
              {t('nav.getStarted')}
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
              {t('landing.heroLabel')}
            </div>
            <h1 className={s.heroH1}>
              {t('landing.heroH1Line1')}
              <br />
              <span className={s.heroEm}>{t('landing.heroH1Line2')}</span>
            </h1>
            <p className={s.heroP}>
              {t('landing.heroDesc')}
            </p>
            <div className={s.heroCtas}>
              <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "hero" }); navigate({ to: "/register" }); }} className={s.ctaPrimary}>
                {t('landing.ctaPrimary')}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9h10M10 5l4 4-4 4" />
                </svg>
              </button>
              <span className={s.ctaNote}>{t('landing.ctaNote')}</span>
            </div>
            <div className={s.heroStats}>
              <div className={s.stat}>
                <span className={s.statNum}>3</span>
                <span className={s.statLabel}>{t('landing.statLanguages')}</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statNum}>&#8734;</span>
                <span className={s.statLabel}>{t('landing.statVideos')}</span>
              </div>
              <div className={s.statDivider} />
              <div className={s.stat}>
                <span className={s.statNum}>1-click</span>
                <span className={s.statLabel}>{t('landing.statLookup')}</span>
              </div>
            </div>
          </div>

          <div className={s.heroRight}>
            <div className={s.heroCard}>
              <div className={s.hcHeader}>
                <span className={s.hcDot} style={{ background: '#ff5f57' }} />
                <span className={s.hcDot} style={{ background: '#ffbd2e' }} />
                <span className={s.hcDot} style={{ background: '#28c841' }} />
                <span className={s.hcUrl}>languni.app/player</span>
              </div>
              <div className={s.hcBody}>
                <div className={s.hcVideo}>
                  <img src={thumbnail} alt="" className={s.hcThumb} fetchpriority="high" />
                  <div className={s.hcPlay}>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.45)" />
                      <polygon points="13,10 23,16 13,22" fill="#fff" />
                    </svg>
                  </div>
                </div>
                <div className={s.hcCaptions}>
                  <div className={s.hcCapLine}>
                    <span className={s.hcTime}>1:24</span>
                    {card.line1Before}{" "}
                    <span className={s.hcHL}>{card.line1HL}</span>{" "}
                    {card.line1After}
                  </div>
                  <div className={`${s.hcCapLine} ${s.hcCapActive}`}>
                    <span className={s.hcTime}>1:27</span>
                    {card.line2Before}{" "}
                    <span className={s.hcHL}>{card.line2HL}</span>{" "}
                    {card.line2After}
                  </div>
                </div>
                <div className={s.hcPopup}>
                  <div className={s.hcPopupWord}>{card.word}</div>
                  <div className={s.hcPopupDef}>{card.def}</div>
                  <div className={s.hcPopupCtx}>{card.ctx}</div>
                  <div className={s.hcPopupBtn}>{t('landing.heroCardSave')}</div>
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
            <span className={s.tag}>{t('landing.problemTag')}</span>
            <h2 className={s.sectionH2}>
              {t('landing.problemH2')}
            </h2>
          </div>

          <div className={s.problemGrid}>
            <div className={s.problemItem}>
              <span className={s.problemNum}>01</span>
              <h3>{t('landing.problem1Title')}</h3>
              <p>{t('landing.problem1Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>02</span>
              <h3>{t('landing.problem2Title')}</h3>
              <p>{t('landing.problem2Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>03</span>
              <h3>{t('landing.problem3Title')}</h3>
              <p>{t('landing.problem3Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>04</span>
              <h3>{t('landing.problem4Title')}</h3>
              <p>{t('landing.problem4Desc')}</p>
            </div>
          </div>

          <div className={s.problemSolution}>
            <div className={s.solLine} />
            <p className={s.solText}>
              {t('landing.solutionText')}
              <strong>{t('landing.solutionHighlight')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS — Tall Cards ===== */}
      <section className={s.benefits} id="benefits">
        <div className={s.sectionInner}>
          <span className={s.tag}>{t('landing.featuresTag')}</span>
          <h2 className={s.sectionH2}>
            {t('landing.featuresH2Line1')}<br />{t('landing.featuresH2Line2')}
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
              <h3>{t('landing.feat1Title')}</h3>
              <p>{t('landing.feat1Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="14" cy="10" r="7" />
                  <path d="M7 24c0-4 3-7 7-7s7 3 7 7" strokeLinecap="round" />
                </svg>
              </div>
              <h3>{t('landing.feat2Title')}</h3>
              <p>{t('landing.feat2Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 4h14a2 2 0 0 1 2 2v17l-7-4-7 4V6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>{t('landing.feat3Title')}</h3>
              <p>{t('landing.feat3Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="20" height="20" rx="4" />
                  <path d="M10 14h8M14 10v8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>{t('landing.feat4Title')}</h3>
              <p>{t('landing.feat4Desc')}</p>
              <div className={s.featAccent} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING — Table Style ===== */}
      <section className={s.pricing} id="pricing">
        <div className={s.sectionInner}>
          <span className={s.tag}>{t('landing.pricingTag')}</span>
          <h2 className={s.sectionH2}>
            {t('landing.pricingH2')}
          </h2>
          <p className={s.sectionP}>
            {t('landing.pricingSubtitle')}
          </p>

          <div className={s.priceGrid}>
            {/* Free */}
            <div className={s.priceCard}>
              <div className={s.priceTop}>
                <h3 className={s.pName}>{t('landing.freePlan')}</h3>
                <div className={s.pAmount}>{t('landing.freeAmount')}</div>
                <p className={s.pSub}>{t('landing.freeForever')}</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>{t('landing.freeFeat1')}</li>
                <li className={s.pYes}>{t('landing.freeFeat2')}</li>
                <li className={s.pYes}>{t('landing.freeFeat3')}</li>
                <li className={s.pYes}>{t('landing.freeFeat4')}</li>
                <li className={s.pYes}>{t('landing.freeFeat5')}</li>
              </ul>
              <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "pricing_free" }); navigate({ to: "/register" }); }} className={s.pBtnLight}>
                {t('nav.getStarted')}
              </button>
            </div>

            {/* Premium */}
            <div className={`${s.priceCard} ${s.priceCardPop}`}>
              <div className={s.popTag}>{t('landing.popular')}</div>
              <div className={s.priceTop}>
                <h3 className={s.pName}>{t('landing.premiumPlan')}</h3>
                <div className={s.pAmount}>
                  $5<span className={s.pMo}>/mo</span>
                </div>
                <p className={s.pSub}>{t('landing.premiumYearly')}</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>{t('landing.premiumFeat1')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat2')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat3')}<span className={s.pSoon}>{t('landing.comingSoon')}</span></li>
                <li className={s.pYes}>{t('landing.premiumFeat4')}<span className={s.pSoon}>{t('landing.comingSoon')}</span></li>
                <li className={s.pYes}>{t('landing.premiumFeat5')}</li>
              </ul>
              <button
                onClick={() => { posthog.capture("upgrade_clicked", { source: "landing_pricing", plan: "monthly" }); handleUpgrade("monthly"); }}
                className={s.pBtnSolid}
                disabled={checkoutLoading !== null}
              >
                {checkoutLoading ? "..." : t('landing.startPremium')}
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
              <h2 className={s.footerH2}>{t('landing.footerCta')}</h2>
              <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "footer" }); navigate({ to: "/register" }); }} className={s.ctaPrimary}>
                {t('landing.ctaPrimary')}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9h10M10 5l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>

          <div className={s.footerDivider} />

          <div className={s.footerBottom}>
            <a href="/" className={s.footerLogo}>
              <img src={languni} alt="Languni" width="108" height="28" />
            </a>
            <div className={s.footerLinks}>
              <a href="#benefits">{t('landing.footerFeatLink')}</a>
              <a href="#pricing">{t('landing.footerPricingLink')}</a>
              <a href="/contact">{t('landing.footerContact')}</a>
              <a href="/privacy">{t('landing.footerPrivacy')}</a>
              <a href="/terms">{t('landing.footerTerms')}</a>
            </div>
            <div className={s.langSwitcher}>
              {LANG_OPTIONS.map(({ code, label }) => (
                <button
                  key={code}
                  className={`${s.langBtn} ${i18n.language === code ? s.langBtnActive : ""}`}
                  onClick={() => i18n.changeLanguage(code)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className={s.footerCopy}>{t('landing.footerCopy')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
