import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import s from "../styles/LegalPage.module.css";
import ws from "../styles/Welcome.module.css";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className={ws.page}>
      <Helmet>
        <title>Privacy Policy | Languni</title>
        <meta name="description" content="Learn how Languni collects, uses, and protects your personal data." />
        <link rel="canonical" href="https://languni.dev/privacy" />
      </Helmet>

      {/* ===== HEADER ===== */}
      <PublicNavbar />

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
      <PublicFooter />
    </div>
  );
}
