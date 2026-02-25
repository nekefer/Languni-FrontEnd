import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import s from "../styles/Welcome.module.css";

const LANG_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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
            <a href="#hero" className={s.navLink}>{t('nav.home')}</a>
            <a href="#problem" className={s.navLink}>{t('nav.whyLinguini')}</a>
            <a href="#benefits" className={s.navLink}>{t('nav.features')}</a>
            <a href="#pricing" className={s.navLink}>{t('nav.pricing')}</a>
          </nav>
          <div className={s.headerRight}>
            <button onClick={() => navigate({ to: "/login" })} className={s.loginBtn}>
              {t('nav.login')}
            </button>
            <button onClick={() => navigate({ to: "/register" })} className={s.startBtn}>
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
              <button onClick={() => navigate({ to: "/register" })} className={s.ctaPrimary}>
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
                  <path d="M14 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
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
                <li className={s.pNo}>{t('landing.freeNoFeat1')}</li>
                <li className={s.pNo}>{t('landing.freeNoFeat2')}</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnLight}>
                {t('nav.getStarted')}
              </button>
            </div>

            {/* Pro */}
            <div className={`${s.priceCard} ${s.priceCardPop}`}>
              <div className={s.popTag}>{t('landing.popular')}</div>
              <div className={s.priceTop}>
                <h3 className={s.pName}>{t('landing.proPlan')}</h3>
                <div className={s.pAmount}>
                  $6<span className={s.pMo}>/mo</span>
                </div>
                <p className={s.pSub}>{t('landing.proYearly')}</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>{t('landing.proFeat1')}</li>
                <li className={s.pYes}>{t('landing.proFeat2')}</li>
                <li className={s.pYes}>{t('landing.proFeat3')}</li>
                <li className={s.pYes}>{t('landing.proFeat4')}</li>
                <li className={s.pYes}>{t('landing.proFeat5')}</li>
                <li className={s.pYes}>{t('landing.proFeat6')}</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnSolid}>
                {t('landing.startPro')}
              </button>
            </div>

            {/* Premium */}
            <div className={s.priceCard}>
              <div className={s.priceTop}>
                <h3 className={s.pName}>{t('landing.premiumPlan')}</h3>
                <div className={s.pAmount}>
                  $15<span className={s.pMo}>/mo</span>
                </div>
                <p className={s.pSub}>{t('landing.premiumYearly')}</p>
              </div>
              <ul className={s.pList}>
                <li className={s.pYes}>{t('landing.premiumFeat1')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat2')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat3')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat4')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat5')}</li>
                <li className={s.pYes}>{t('landing.premiumFeat6')}</li>
              </ul>
              <button onClick={() => navigate({ to: "/register" })} className={s.pBtnLight}>
                {t('landing.startPremium')}
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
              <button onClick={() => navigate({ to: "/register" })} className={s.ctaPrimary}>
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
              Lingu<span className={s.logoAcc}>ini</span>
            </a>
            <div className={s.footerLinks}>
              <a href="#benefits">{t('landing.footerFeatLink')}</a>
              <a href="#pricing">{t('landing.footerPricingLink')}</a>
              <a href="#">{t('landing.footerPrivacy')}</a>
              <a href="#">{t('landing.footerTerms')}</a>
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
