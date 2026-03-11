import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import s from "../styles/LegalPage.module.css";
import ws from "../styles/Welcome.module.css";
import languni from "../assets/Languni.webp";

const LANG_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={ws.page}>
      <Helmet>
        <title>Privacy Policy | Languni</title>
        <meta name="description" content="Learn how Languni collects, uses, and protects your personal data." />
        <link rel="canonical" href="https://languni.dev/privacy" />
      </Helmet>

      {/* ===== HEADER ===== */}
      <header className={`${ws.header} ${scrolled ? ws.headerScrolled : ""}`}>
        <div className={ws.headerInner}>
          <a href="/" className={ws.logo}>
            <img src={languni} alt="Languni" width="124" height="32" />
          </a>
          <nav className={ws.nav}>
            <a href="/#hero" className={ws.navLink}>{t("nav.home")}</a>
            <a href="/#problem" className={ws.navLink}>{t("nav.whyLanguni")}</a>
            <a href="/#benefits" className={ws.navLink}>{t("nav.features")}</a>
            <a href="/#pricing" className={ws.navLink}>{t("nav.pricing")}</a>
          </nav>
          <div className={ws.headerRight}>
            <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "header_login" }); navigate({ to: "/login" }); }} className={ws.loginBtn}>
              {t("nav.login")}
            </button>
            <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "header_register" }); navigate({ to: "/register" }); }} className={ws.startBtn}>
              {t("nav.getStarted")}
            </button>
          </div>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <div className={s.container}>
        <div className={s.hero}>
          <span className={s.tag}>{t("privacy.tag")}</span>
          <h1 className={s.title}>{t("privacy.title")}</h1>
          <p className={s.meta}>{t("privacy.lastUpdated")}</p>
        </div>

        <nav className={s.toc}>
          <p className={s.tocTitle}>{t("privacy.tocTitle")}</p>
          <ol className={s.tocList}>
            <li><a href="#s1">{t("privacy.toc.t1")}</a></li>
            <li><a href="#s2">{t("privacy.toc.t2")}</a></li>
            <li><a href="#s3">{t("privacy.toc.t3")}</a></li>
            <li><a href="#s4">{t("privacy.toc.t4")}</a></li>
            <li><a href="#s5">{t("privacy.toc.t5")}</a></li>
            <li><a href="#s6">{t("privacy.toc.t6")}</a></li>
            <li><a href="#s7">{t("privacy.toc.t7")}</a></li>
            <li><a href="#s8">{t("privacy.toc.t8")}</a></li>
            <li><a href="#s9">{t("privacy.toc.t9")}</a></li>
            <li><a href="#s10">{t("privacy.toc.t10")}</a></li>
            <li><a href="#s11">{t("privacy.toc.t11")}</a></li>
          </ol>
        </nav>

        <div className={s.highlight}><p>{t("privacy.intro")}</p></div>

        <div className={s.section} id="s1">
          <h2>{t("privacy.s1Title")}</h2>
          <p><strong>{t("privacy.s1AccountLabel")}:</strong> {t("privacy.s1AccountDesc")}</p>
          <p><strong>{t("privacy.s1LearningLabel")}:</strong> {t("privacy.s1LearningDesc")}</p>
          <p><strong>{t("privacy.s1UsageLabel")}:</strong> {t("privacy.s1UsageDesc")}</p>
          <p><strong>{t("privacy.s1AuthLabel")}:</strong> {t("privacy.s1AuthDesc")}</p>
          <p><strong>{t("privacy.s1TechnicalLabel")}:</strong> {t("privacy.s1TechnicalDesc")}</p>
          <p><strong>{t("privacy.s1PaymentLabel")}:</strong> {t("privacy.s1PaymentDesc")}</p>
        </div>

        <div className={s.section} id="s2">
          <h2>{t("privacy.s2Title")}</h2>
          <ul>
            <li>{t("privacy.s2li1")}</li>
            <li>{t("privacy.s2li2")}</li>
            <li>{t("privacy.s2li3")}</li>
            <li>{t("privacy.s2li4")}</li>
            <li>{t("privacy.s2li5")}</li>
            <li>{t("privacy.s2li6")}</li>
            <li>{t("privacy.s2li7")}</li>
          </ul>
          <p>{t("privacy.s2NoSell")}</p>
        </div>

        <div className={s.section} id="s3">
          <h2>{t("privacy.s3Title")}</h2>
          <p>{t("privacy.s3p1")}</p>
        </div>

        <div className={s.section} id="s4">
          <h2>{t("privacy.s4Title")}</h2>
          <ul>
            <li>
              <strong>Google OAuth & YouTube</strong> — {t("privacy.s4GoogleDesc")}{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{t("privacy.s4GoogleLink")}</a>.{" "}
              {t("privacy.s4YouTubeTos")}{" "}
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">{t("privacy.s4YouTubeTosLink")}</a>.
            </li>
            <li>
              <strong>Lemon Squeezy</strong> — {t("privacy.s4LemonDesc")}{" "}
              <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer">{t("privacy.s4LinkText")}</a>.
            </li>
            <li>
              <strong>PostHog</strong> — {t("privacy.s4PosthogDesc")}{" "}
              <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">{t("privacy.s4LinkText")}</a>.
            </li>
            <li>
              <strong>SendGrid</strong> — {t("privacy.s4SendgridDesc")}{" "}
              <a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer">{t("privacy.s4LinkText")}</a>.
            </li>
          </ul>
        </div>

        <div className={s.section} id="s5">
          <h2>{t("privacy.s5Title")}</h2>
          <p>{t("privacy.s5p1")}</p>
          <p>{t("privacy.s5p2")}</p>
          <p>{t("privacy.s5p3")}</p>
        </div>

        <div className={s.section} id="s6">
          <h2>{t("privacy.s6Title")}</h2>
          <p>{t("privacy.s6p1")}</p>
          <p>{t("privacy.s6p2")}</p>
        </div>

        <div className={s.section} id="s7">
          <h2>{t("privacy.s7Title")}</h2>
          <p>{t("privacy.s7p1")}</p>
          <ul>
            <li><strong>{t("privacy.s7AccessLabel")}:</strong> {t("privacy.s7AccessDesc")}</li>
            <li><strong>{t("privacy.s7CorrectionLabel")}:</strong> {t("privacy.s7CorrectionDesc")}</li>
            <li><strong>{t("privacy.s7DeletionLabel")}:</strong> {t("privacy.s7DeletionDesc")}</li>
            <li><strong>{t("privacy.s7PortabilityLabel")}:</strong> {t("privacy.s7PortabilityDesc")}</li>
            <li><strong>{t("privacy.s7ObjectionLabel")}:</strong> {t("privacy.s7ObjectionDesc")}</li>
          </ul>
          <p>{t("privacy.s7p2")} <a href="mailto:contact@languni.dev">contact@languni.dev</a>.</p>
        </div>

        <div className={s.section} id="s8">
          <h2>{t("privacy.s8Title")}</h2>
          <p>{t("privacy.s8p1")}</p>
        </div>

        <div className={s.section} id="s9">
          <h2>{t("privacy.s9Title")}</h2>
          <p>{t("privacy.s9p1")}</p>
        </div>

        <div className={s.section} id="s10">
          <h2>{t("privacy.s10Title")}</h2>
          <p>{t("privacy.s10p1")}</p>
        </div>

        <div className={s.section} id="s11">
          <h2>{t("privacy.s11Title")}</h2>
          <p>{t("privacy.s11p1")}</p>
          <p><strong>{t("privacy.s11EmailLabel")}:</strong> <a href="mailto:contact@languni.dev">contact@languni.dev</a></p>
        </div>

        <hr className={s.divider} />
      </div>

      {/* ===== FOOTER ===== */}
      <footer className={ws.footer}>
        <div className={ws.footerInner}>
          <div className={ws.footerTop}>
            <div className={ws.footerCta}>
              <h2 className={ws.footerH2}>{t("landing.footerCta")}</h2>
              <button onClick={() => { posthog.capture("landing_cta_clicked", { location: "footer" }); navigate({ to: "/register" }); }} className={ws.ctaPrimary}>
                {t("landing.ctaPrimary")}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 9h10M10 5l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>
          <div className={ws.footerDivider} />
          <div className={ws.footerBottom}>
            <a href="/" className={ws.footerLogo}>
              <img src={languni} alt="Languni" width="108" height="28" />
            </a>
            <div className={ws.footerLinks}>
              <a href="/#benefits">{t("landing.footerFeatLink")}</a>
              <a href="/#pricing">{t("landing.footerPricingLink")}</a>
              <a href="/contact">{t("landing.footerContact")}</a>
              <a href="/privacy">{t("landing.footerPrivacy")}</a>
              <a href="/terms">{t("landing.footerTerms")}</a>
            </div>
            <div className={ws.langSwitcher}>
              {LANG_OPTIONS.map(({ code, label }) => (
                <button key={code} className={`${ws.langBtn} ${i18n.language === code ? ws.langBtnActive : ""}`} onClick={() => i18n.changeLanguage(code)}>
                  {label}
                </button>
              ))}
            </div>
            <p className={ws.footerCopy}>{t("landing.footerCopy")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
