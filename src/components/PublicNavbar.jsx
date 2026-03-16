import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import s from "../styles/Welcome.module.css";
import languni from "../assets/Languni.webp";

/**
 * Shared navbar for all public pages (landing, about, contact, legal).
 * @param {boolean} isLanding - When true, nav links use #anchor (no page reload).
 *                              When false (default), uses /#anchor for external pages.
 * @param {string}  activePage - e.g. "about" to highlight the active link.
 */
export default function PublicNavbar({ isLanding = false, activePage = "" }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prefix = isLanding ? "" : "/";

  return (
    <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
      <div className={s.headerInner}>
        <a href="/" className={s.logo}>
          <img src={languni} alt="Languni" width="124" height="32" />
        </a>

        <nav className={s.nav}>
          <a href={`${prefix}#hero`} className={`${s.navLink} ${activePage === "home" ? s.navLinkActive : ""}`}>
            {t("nav.home")}
          </a>
          <a href="/about" className={`${s.navLink} ${activePage === "about" ? s.navLinkActive : ""}`}>
            About
          </a>
          <a href={`${prefix}#benefits`} className={`${s.navLink} ${activePage === "features" ? s.navLinkActive : ""}`}>
            {t("nav.features")}
          </a>
          <a href={`${prefix}#pricing`} className={`${s.navLink} ${activePage === "pricing" ? s.navLinkActive : ""}`}>
            {t("nav.pricing")}
          </a>
        </nav>

        <div className={s.headerRight}>
          <button
            onClick={() => {
              posthog.capture("landing_cta_clicked", { location: "header_login" });
              navigate({ to: "/login" });
            }}
            className={s.loginBtn}
          >
            {t("nav.login")}
          </button>
          <button
            onClick={() => {
              posthog.capture("landing_cta_clicked", { location: "header_register" });
              navigate({ to: "/register" });
            }}
            className={s.startBtn}
          >
            {t("nav.getStarted")}
          </button>
        </div>
      </div>
    </header>
  );
}
