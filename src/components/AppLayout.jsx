import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, Clapperboard, BookOpen, Settings, Menu, Sun, Moon, Flame, Sparkles, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { VerificationBanner } from "./VerificationBanner";
import { PremiumGate } from "./PremiumGate";
import { getUserInitials } from "../utils/avatar";
import styles from "../styles/AppLayout.module.css";
import languni from "../assets/Languni.png";
import languniDark from "../assets/Languni dark.png";

export function AppLayout({ children }) {
  const { t } = useTranslation();
  const { user, logout, isPremium } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { resetOnboardingState } = useOnboarding();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = getUserInitials(user);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    resetOnboardingState();
    navigate({ to: "/" });
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className={styles.appLayout}>

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link to="/dashboard" className={styles.logo} onClick={closeSidebar}>
            <img src={isDark ? languniDark : languni} alt="Languni" height="36" />
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          <Link
            to="/dashboard"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}><Home size={18} /></span>
            <span>{t("nav.appDashboard")}</span>
          </Link>

          <Link
            to="/trending"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}><Flame size={18} /></span>
            <span>{t("nav.appTrending")}</span>
          </Link>

          {isPremium ? (
            <Link
              to="/recommended"
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
              onClick={closeSidebar}
            >
              <span className={styles.navIcon}><Sparkles size={18} /></span>
              <span>{t("nav.appForYou")}</span>
            </Link>
          ) : (
            <button
              className={`${styles.navLink} ${styles.navLinkLocked}`}
              onClick={() => { closeSidebar(); setGateOpen(true); }}
            >
              <span className={styles.navIcon}><Sparkles size={18} /></span>
              <span>{t("nav.appForYou")}</span>
              <Lock size={13} className={styles.lockIcon} />
            </button>
          )}

          <Link
            to="/library"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}><Clapperboard size={18} /></span>
            <span>{t("nav.appLibrary")}</span>
          </Link>

          <Link
            to="/words"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}><BookOpen size={18} /></span>
            <span>{t("nav.appVocabulary")}</span>
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link
            to="/settings"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}><Settings size={18} /></span>
            <span>{t("nav.appSettings")}</span>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} />
      )}

      {/* ── Main (top bar + content) ── */}
      <div className={styles.appMain}>
        <header className={styles.topBar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <Link to="/dashboard" className={styles.topBarLogo}>
            <img src={isDark ? languniDark : languni} alt="Languni" height="36" />
          </Link>

          <div className={styles.topBarSpacer} />

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={styles.avatarWrap} ref={dropdownRef}>
            <button
              className={styles.avatar}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <div className={styles.dropdownNameRow}>
                    <span className={styles.dropdownName}>
                      {user?.first_name} {user?.last_name}
                    </span>
                    {isPremium && (
                      <span className={styles.planBadge}>Premium</span>
                    )}
                  </div>
                  <span className={styles.dropdownEmail}>{user?.email}</span>
                </div>
                <hr className={styles.dropdownDivider} />
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  {t("nav.signOut")}
                </button>
              </div>
            )}
          </div>
        </header>

        <VerificationBanner />

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>

      {gateOpen && <PremiumGate onClose={() => setGateOpen(false)} />}
    </div>
  );
}
