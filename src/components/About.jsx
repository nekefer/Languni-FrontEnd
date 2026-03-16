import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import s from "../styles/About.module.css";
import danielPhoto from "../assets/daniel.webp";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Daniel Kloutse",
  url: "https://languni.dev/about",
  sameAs: [
    "https://www.linkedin.com/in/danielkloutse/",
    "https://twitter.com/daniel_lnch",
  ],
  jobTitle: "Software Engineer & Founder",
  description:
    "Daniel Kloutse is the founder of Languni, a language learning platform built around real YouTube videos.",
};

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("about.pageTitle")}</title>
        <meta name="description" content={t("about.metaDescription")} />
        <link rel="canonical" href="https://languni.dev/about" />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={t("about.pageTitle")} />
        <meta property="og:description" content={t("about.metaDescription")} />
        <meta property="og:url" content="https://languni.dev/about" />
        <meta property="og:image" content="https://languni.dev/og-image.png" />
        <meta property="profile:first_name" content="Daniel" />
        <meta property="profile:last_name" content="Kloutse" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("about.pageTitle")} />
        <meta name="twitter:description" content={t("about.metaDescription")} />
        <meta name="twitter:site" content="@daniel_lnch" />
        <meta name="twitter:creator" content="@daniel_lnch" />

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(STRUCTURED_DATA)}
        </script>
      </Helmet>

      <PublicNavbar activePage="about" />

      {/* ── Main ── */}
      <main className={s.page}>
        <div className={s.card}>
          <div className={s.body}>
            <div className={s.content}>
              <p className={s.greeting}>{t("about.greeting")}</p>

              <p className={s.text}>{t("about.p1")}</p>

              <p className={s.text}>{t("about.p2")}</p>

              <p className={s.text}>
                <span className={s.brandName}><span className={s.lang}>Lang</span><span className={s.uni}>uni</span></span>{" "}
                {t("about.p3a")}{" "}
                <span className={s.brandName}><span className={s.lang}>Lang</span><span className={s.uni}>uni</span></span>.{" "}
                <span className={s.lang}>Lang</span>{" "}{t("about.p3b")}{" "}<span className={s.uni}>uni</span>{" "}{t("about.p3c")}
              </p>

              <p className={s.text}>{t("about.p4")}</p>

              <div className={s.links}>
                <a
                  href="https://www.linkedin.com/in/danielkloutse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.socialLink}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com/daniel_lnch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.socialLink}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  @daniel_lnch
                </a>
                <a href="/contact" className={s.socialLink}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {t("about.contact")}
                </a>
              </div>
            </div>

            <div className={s.photoWrap}>
              <img
                src={danielPhoto}
                alt={t("about.photoAlt")}
                className={s.photo}
                width="160"
                height="160"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <PublicFooter />
    </>
  );
}
