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

export default function TermsOfService() {
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
        <title>Terms of Service | Languni</title>
        <meta name="description" content="Read the terms and conditions for using Languni." />
        <link rel="canonical" href="https://languni.dev/terms" />
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
          <span className={s.tag}>{t("terms.tag")}</span>
          <h1 className={s.title}>{t("terms.title")}</h1>
          <p className={s.meta}>{t("terms.lastUpdated")}</p>
        </div>

        <nav className={s.toc}>
          <p className={s.tocTitle}>{t("terms.tocTitle")}</p>
          <ol className={s.tocList}>
            <li><a href="#s1">{t("terms.toc.t1")}</a></li>
            <li><a href="#s2">{t("terms.toc.t2")}</a></li>
            <li><a href="#s3">{t("terms.toc.t3")}</a></li>
            <li><a href="#s4">{t("terms.toc.t4")}</a></li>
            <li><a href="#s5">{t("terms.toc.t5")}</a></li>
            <li><a href="#s6">{t("terms.toc.t6")}</a></li>
            <li><a href="#s7">{t("terms.toc.t7")}</a></li>
            <li><a href="#s8">{t("terms.toc.t8")}</a></li>
            <li><a href="#s9">{t("terms.toc.t9")}</a></li>
            <li><a href="#s10">{t("terms.toc.t10")}</a></li>
            <li><a href="#s11">{t("terms.toc.t11")}</a></li>
            <li><a href="#s12">{t("terms.toc.t12")}</a></li>
            <li><a href="#s13">{t("terms.toc.t13")}</a></li>
            <li><a href="#s14">{t("terms.toc.t14")}</a></li>
          </ol>
        </nav>

        <div className={s.highlight}><p>{t("terms.intro")}</p></div>

        <div className={s.section} id="s1">
          <h2>{t("terms.s1Title")}</h2>
          <p>{t("terms.s1p1")}</p>
        </div>

        <div className={s.section} id="s2">
          <h2>{t("terms.s2Title")}</h2>
          <p>{t("terms.s2p1")}</p>
          <ul>
            <li>{t("terms.s2li1")}</li>
            <li>{t("terms.s2li2")}</li>
            <li>{t("terms.s2li3")}</li>
            <li>{t("terms.s2li4")}</li>
          </ul>
          <p>{t("terms.s2p2")}</p>
        </div>

        <div className={s.section} id="s3">
          <h2>{t("terms.s3Title")}</h2>
          <p>{t("terms.s3p1")}</p>
          <ul>
            <li>{t("terms.s3li1")}</li>
            <li>{t("terms.s3li2")}</li>
            <li>{t("terms.s3li3")}</li>
          </ul>
          <p>{t("terms.s3p2")}</p>
        </div>

        <div className={s.section} id="s4">
          <h2>{t("terms.s4Title")}</h2>
          <p>{t("terms.s4p1")}</p>
          <p>{t("terms.s4p2")}</p>
          <ul>
            <li><strong>{t("terms.s4CancelLabel")}:</strong> {t("terms.s4CancelDesc")}</li>
            <li><strong>{t("terms.s4RefundLabel")}:</strong> {t("terms.s4RefundDesc")} <a href="mailto:contact@languni.dev">contact@languni.dev</a>.</li>
            <li><strong>{t("terms.s4PriceLabel")}:</strong> {t("terms.s4PriceDesc")}</li>
          </ul>
        </div>

        <div className={s.section} id="s5">
          <h2>{t("terms.s5Title")}</h2>
          <p>{t("terms.s5p1")}</p>
        </div>

        <div className={s.section} id="s6">
          <h2>{t("terms.s6Title")}</h2>
          <p>{t("terms.s6p1")}</p>
          <ul>
            <li>{t("terms.s6li1")}</li>
            <li>{t("terms.s6li2")}</li>
            <li>{t("terms.s6li3")}</li>
            <li>{t("terms.s6li4")}</li>
            <li>{t("terms.s6li5")}</li>
            <li>{t("terms.s6li6")}</li>
          </ul>
          <p>{t("terms.s6p2")}</p>
        </div>

        <div className={s.section} id="s7">
          <h2>{t("terms.s7Title")}</h2>
          <p>{t("terms.s7p1")}</p>
          <p>
            {t("terms.s7p2Start")}{" "}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">{t("terms.s7LinkText")}</a>.{" "}
            {t("terms.s7p2End")}
          </p>
        </div>

        <div className={s.section} id="s8">
          <h2>{t("terms.s8Title")}</h2>
          <p>{t("terms.s8p1")}</p>
          <p>{t("terms.s8p2")}</p>
        </div>

        <div className={s.section} id="s9">
          <h2>{t("terms.s9Title")}</h2>
          <p>{t("terms.s9p1")}</p>
          <p>{t("terms.s9p2")}</p>
        </div>

        <div className={s.section} id="s10">
          <h2>{t("terms.s10Title")}</h2>
          <p>{t("terms.s10p1")}</p>
          <p>{t("terms.s10p2")}</p>
        </div>

        <div className={s.section} id="s11">
          <h2>{t("terms.s11Title")}</h2>
          <p>{t("terms.s11p1")}</p>
          <p>{t("terms.s11p2")}</p>
        </div>

        <div className={s.section} id="s12">
          <h2>{t("terms.s12Title")}</h2>
          <p>{t("terms.s12p1")}</p>
        </div>

        <div className={s.section} id="s13">
          <h2>{t("terms.s13Title")}</h2>
          <p>{t("terms.s13p1")}</p>
        </div>

        <div className={s.section} id="s14">
          <h2>{t("terms.s14Title")}</h2>
          <p>{t("terms.s14p1")}</p>
          <p><strong>{t("terms.s14EmailLabel")}:</strong> <a href="mailto:contact@languni.dev">contact@languni.dev</a></p>
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
