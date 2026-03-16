import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import s from "../styles/LegalPage.module.css";
import ws from "../styles/Welcome.module.css";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className={ws.page}>
      <Helmet>
        <title>Terms of Service | Languni</title>
        <meta name="description" content="Read the terms and conditions for using Languni." />
        <link rel="canonical" href="https://languni.dev/terms" />
      </Helmet>

      {/* ===== HEADER ===== */}
      <PublicNavbar />

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
          <p>{t("terms.s10p3")}</p>
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
      <PublicFooter />
    </div>
  );
}
