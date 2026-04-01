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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const prefix = isLanding ? "" : "/";

  const navLinks = [
    { href: `${prefix}#hero`,     label: t("nav.home"),     page: "home" },
    { href: "/about",             label: "About",            page: "about" },
    { href: `${prefix}#benefits`, label: t("nav.features"), page: "features" },
    { href: `${prefix}#pricing`,  label: t("nav.pricing"),  page: "pricing" },
  ];

  return (
    <>
      <header className={`${s.header} ${scrolled ? s.headerScrolled : ""} ${menuOpen ? s.headerMenuOpen : ""}`}>
        <div className={s.headerInner}>
          <a href="/" className={s.logo} onClick={close}>
            <img src={languni} alt="Languni" width="124" height="32" />
          </a>

          {/* Desktop nav */}
          <nav className={s.nav}>
            {navLinks.map(({ href, label, page }) => (
              <a
                key={page}
                href={href}
                className={`${s.navLink} ${activePage === page ? s.navLinkActive : ""}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop buttons */}
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

          {/* Hamburger — mobile only */}
          <button
            className={s.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="18" y2="18" />
                <line x1="18" y1="4" x2="4" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
            )}
          </button>
        </div>

      </header>

      {/* Mobile menu — wrapper clips the slide, menu animates inside */}
      <div className={`${s.mobileMenuWrapper} ${menuOpen ? s.mobileMenuWrapperOpen : ""}`}>
      <div className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOpen : ""}`}>
        <nav className={s.mobileNav}>
          {navLinks.map(({ href, label, page }) => (
            <a
              key={page}
              href={href}
              className={`${s.mobileNavLink} ${activePage === page ? s.navLinkActive : ""}`}
              onClick={close}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className={s.mobileBtns}>
          <button
            onClick={() => { close(); posthog.capture("landing_cta_clicked", { location: "mobile_menu_login" }); navigate({ to: "/login" }); }}
            className={s.mobilLoginBtn}
          >
            {t("nav.login")}
          </button>
          <button
            onClick={() => { close(); posthog.capture("landing_cta_clicked", { location: "mobile_menu_register" }); navigate({ to: "/register" }); }}
            className={s.startBtn}
          >
            {t("nav.getStarted")}
          </button>
        </div>
      </div>
      </div>{/* /mobileMenuWrapper */}

    </>
  );
}
