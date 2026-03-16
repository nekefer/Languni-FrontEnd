import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import s from "../styles/Welcome.module.css";
import languni from "../assets/Languni.webp";

const LANG_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function PublicFooter() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerTop}>
          <div className={s.footerCta}>
            <h2 className={s.footerH2}>{t("landing.footerCta")}</h2>
            <button
              onClick={() => {
                posthog.capture("landing_cta_clicked", { location: "footer" });
                navigate({ to: "/register" });
              }}
              className={s.ctaPrimary}
            >
              {t("landing.ctaPrimary")}
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
            <a href="/#benefits">{t("landing.footerFeatLink")}</a>
            <a href="/#pricing">{t("landing.footerPricingLink")}</a>
            <a href="/about">About</a>
            <a href="/contact">{t("landing.footerContact")}</a>
            <a href="/privacy">{t("landing.footerPrivacy")}</a>
            <a href="/terms">{t("landing.footerTerms")}</a>
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
          <p className={s.footerCopy}>{t("landing.footerCopy")}</p>
        </div>
      </div>
    </footer>
  );
}
