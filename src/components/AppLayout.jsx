import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, Clapperboard, BookOpen, Settings, Menu, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { VerificationBanner } from "./VerificationBanner";
import styles from "../styles/AppLayout.module.css";
import languni from "../assets/Languni.png";
import languniDark from "../assets/Languni dark.png";

const NAV_LINKS = [
  { to: "/dashboard", labelKey: "nav.appDashboard", Icon: Home },
  { to: "/library",   labelKey: "nav.appLibrary",   Icon: Clapperboard },
  { to: "/words",     labelKey: "nav.appVocabulary", Icon: BookOpen },
];

export function AppLayout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { resetOnboardingState } = useOnboarding();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user
    ? (
        (user.first_name?.[0] ?? "") +
        (user.last_name?.[0]  ?? "")
      ).toUpperCase() || user.email?.[0]?.toUpperCase() || "?"
    : "?";

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    resetOnboardingState();
    navigate({ to: "/" });
  };

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
    const handler = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className={styles.appLayout}>

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Link to="/dashboard" className={styles.logo} onClick={() => setSidebarOpen(false)}>
            <img src={isDark ? languniDark : languni} alt="Languni" height="36" />
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_LINKS.map(({ to, labelKey, Icon }) => (
            <Link
              key={to}
              to={to}
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}><Icon size={18} /></span>
              <span>{t(labelKey)}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link
            to="/settings"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}><Settings size={18} /></span>
            <span>{t("nav.appSettings")}</span>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main (top bar + content) ── */}
      <div className={styles.appMain}>
        <header className={styles.topBar}>
          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
</button>

          {/* Logo — mobile only (sidebar hidden on mobile) */}
          <Link to="/dashboard" className={styles.topBarLogo}>
            <img src={isDark ? languniDark : languni} alt="Languni" height="36" />
          </Link>

          <div className={styles.topBarSpacer} />

          {/* Theme toggle */}
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile avatar + dropdown */}
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
                  <span className={styles.dropdownName}>
                    {user?.first_name} {user?.last_name}
                  </span>
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

    </div>
  );
}
