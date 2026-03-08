import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import { useAuth } from "../contexts/AuthContext";
import { sendContactMessage } from "../api/contact";
import languni from "../assets/Languni.webp";
import ws from "../styles/Welcome.module.css";
import s from "../styles/Contact.module.css";

const LANG_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const SUBJECTS = [
    { value: "General",          label: t("contact.subjects.general") },
    { value: "Bug report",       label: t("contact.subjects.bugReport") },
    { value: "Billing",          label: t("contact.subjects.billing") },
    { value: "Feature request",  label: t("contact.subjects.featureRequest") },
    { value: "Other",            label: t("contact.subjects.other") },
  ];

  const [form, setForm] = useState({
    name: isAuthenticated ? `${user.first_name} ${user.last_name}` : "",
    email: isAuthenticated ? user.email : "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.subject !== "" &&
    form.message.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      await sendContactMessage(form);
      setSent(true);
    } catch {
      toast.error(t("contact.errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={ws.page}>
      <Helmet>
        <title>Contact | Languni</title>
        <meta name="description" content="Get in touch with the Languni team." />
        <link rel="canonical" href="https://languni.dev/contact" />
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

      {/* ===== CONTACT SECTION ===== */}
      <div className={s.body}>
        <div className={s.container}>
          <div className={s.hero}>
            <h1 className={s.title}>{t("contact.title")}</h1>
            <p className={s.subtitle}>{t("contact.subtitle")}</p>
          </div>

          {sent ? (
            <div className={s.success}>
              <div className={s.successIcon}>✓</div>
              <h2>{t("contact.successTitle")}</h2>
              <p>{t("contact.successDesc")}</p>
              <button className={s.backBtn} onClick={() => navigate({ to: "/" })}>
                {t("contact.backBtn")}
              </button>
            </div>
          ) : (
            <form className={s.form} onSubmit={handleSubmit}>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>{t("contact.nameLabel")} *</label>
                  <input
                    className={s.input}
                    name="name"
                    type="text"
                    placeholder={t("contact.namePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>{t("contact.emailLabel")} *</label>
                  <input
                    className={s.input}
                    name="email"
                    type="email"
                    placeholder={t("contact.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>{t("contact.subjectLabel")} *</label>
                <select
                  className={s.select}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="" hidden>{t("contact.subjectPlaceholder")}</option>
                  {SUBJECTS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>{t("contact.messageLabel")} *</label>
                <textarea
                  className={s.textarea}
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={form.message}
                  onChange={handleChange}
                  rows={7}
                  minLength={10}
                  maxLength={2000}
                  required
                />
                <span className={s.charCount}>{form.message.length} / 2000</span>
              </div>

              <div className={s.formFooter}>
                <button
                  type="submit"
                  className={s.submitBtn}
                  disabled={loading || !isValid}
                >
                  {loading ? t("contact.submitting") : t("contact.submit")}
                </button>
              </div>
            </form>
          )}

          <div className={s.emailFallback}>
            <a href="mailto:contact@languni.dev">contact@languni.dev</a>
          </div>
        </div>
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
                <button
                  key={code}
                  className={`${ws.langBtn} ${i18n.language === code ? ws.langBtnActive : ""}`}
                  onClick={() => i18n.changeLanguage(code)}
                >
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
