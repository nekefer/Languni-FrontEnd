import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile, changePassword, deleteAccount } from "../api/user";
import preferencesService from "../api/preferences";
import { createPortal, getSubscription, createCheckout } from "../api/billing";
import config from "../config";
import { getUserInitials } from "../utils/avatar";
import { LANGUAGES, LEVELS, TOPICS } from "../utils/onboarding";
import styles from "../styles/Settings.module.css";

const PASSWORD_FIELDS = [
  { key: "current", label: "Current password" },
  { key: "next",    label: "New password" },
  { key: "confirm", label: "Confirm new password" },
];

export default function Settings() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, checkAuth, logout, isPremium } = useAuth();

  // ── Profile ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
    }
  }, [user]);

  // ── Learning Prefs ──
  const [prefs, setPrefs] = useState(null);
  const [prefsSaving, setPrefsSaving] = useState(false);

  // ── Password ──
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  // ── Subscription ──
  const [sub, setSub] = useState(null);

  // ── Delete ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // ── Checkout ──
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    Promise.all([
      preferencesService.getPreferences(),
      getSubscription().catch(() => null),
    ]).then(([p, s]) => {
      setPrefs({
        native_language: p.native_language,
        learning_language: p.learning_language,
        level: p.level,
        topics: p.topics ?? [],
      });
      if (s) setSub(s);
    });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setProfileSaving(true);
    try {
      await updateProfile({ first_name: firstName.trim(), last_name: lastName.trim() });
      await checkAuth();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePrefsSave = async () => {
    if (!prefs) return;
    if (prefs.native_language === prefs.learning_language) {
      toast.error("Native language and language to learn can't be the same.");
      return;
    }
    setPrefsSaving(true);
    try {
      await preferencesService.updatePreferences(prefs);
      toast.success("Learning preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setPrefsSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return;
    setPwSaving(true);
    try {
      await changePassword({
        current_password: pwForm.current,
        new_password: pwForm.next,
        new_password_confirm: pwForm.confirm,
      });
      setPwForm({ current: "", next: "", confirm: "" });
      toast.success("Password changed");
    } catch (err) {
      toast.error(err?.response?.data?.detail ?? "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const url = await createPortal();
      window.location.href = url;
    } catch {
      toast.error("Could not open billing portal");
    }
  };

  const handleUpgrade = async (billing = "monthly") => {
    const variantId = billing === "yearly" ? config.lsYearlyVariantId : config.lsMonthlyVariantId;
    if (!variantId) return;
    try {
      setCheckoutLoading(billing);
      const checkoutUrl = await createCheckout(variantId);
      window.location.href = checkoutUrl;
    } catch (err) {
      setCheckoutLoading(null);
      if (err?.response?.status === 403) {
        toast.error("Please verify your email address before upgrading.");
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount(user?.auth_method !== "google" ? deletePassword : null);
      await logout();
      navigate({ to: "/" });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to delete account";
      toast.error(msg);
      setDeleting(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeletePassword("");
    setShowDeleteModal(true);
  };

  const toggleTopic = (id) =>
    setPrefs((p) => ({
      ...p,
      topics: p.topics.includes(id)
        ? p.topics.filter((t) => t !== id)
        : [...p.topics, id],
    }));

  const initials = getUserInitials(user);
  const isGoogleOnly = user?.auth_method === "google";

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Settings | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <h1 className={styles.pageTitle}>Settings</h1>

      {/* ── Profile ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <form className={styles.form} onSubmit={handleProfileSave}>
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.avatarHint}>Avatar is your initials</span>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={50}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <span className={styles.readonlyValue}>{user?.email}</span>
          </div>
          <button className={styles.saveBtn} type="submit" disabled={profileSaving}>
            {profileSaving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      {/* ── Learning Preferences ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Learning Preferences</h2>
        {prefs ? (
          <div className={styles.prefsForm}>

            {/* Native language */}
            <div className={styles.prefRow}>
              <label className={styles.label}>Native language</label>
              <div className={styles.chipGroup}>
                {LANGUAGES.map(({ code, nativeName }) => (
                  <button
                    key={code}
                    type="button"
                    className={`${styles.langChip} ${prefs.native_language === code ? styles.chipActive : ""}`}
                    onClick={() => setPrefs((p) => ({ ...p, native_language: code }))}
                  >
                    {nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning language */}
            <div className={styles.prefRow}>
              <label className={styles.label}>Language to learn</label>
              <div className={styles.chipGroup}>
                {LANGUAGES.map(({ code, nativeName }) => (
                  <button
                    key={code}
                    type="button"
                    className={`${styles.langChip} ${prefs.learning_language === code ? styles.chipActive : ""}`}
                    onClick={() => setPrefs((p) => ({ ...p, learning_language: code }))}
                  >
                    {nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className={styles.prefRow}>
              <label className={styles.label}>Level</label>
              <div className={styles.levelGroup}>
                {LEVELS.map(({ id, icon: Icon, name, description }) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.levelCard} ${prefs.level === id ? styles.chipActive : ""}`}
                    onClick={() => setPrefs((p) => ({ ...p, level: id }))}
                  >
                    <span className={styles.levelIcon}><Icon size={18} /></span>
                    <span className={styles.levelName}>{name}</span>
                    <span className={styles.levelDesc}>{description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className={styles.prefRow}>
              <div className={styles.topicsLabelRow}>
                <label className={styles.label}>Topics</label>
                {prefs.topics.length > 0 && (
                  <span className={styles.topicCount}>{prefs.topics.length} selected</span>
                )}
              </div>
              <div className={styles.topicGroup}>
                {TOPICS.map(({ id, icon: Icon, name }) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.topicChip} ${prefs.topics.includes(id) ? styles.topicChipActive : ""}`}
                    onClick={() => toggleTopic(id)}
                  >
                    <Icon size={16} />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.saveBtn} onClick={handlePrefsSave} disabled={prefsSaving}>
              {prefsSaving ? "Saving…" : "Save preferences"}
            </button>
          </div>
        ) : (
          <p className={styles.loadingText}>Loading…</p>
        )}
      </section>

      {/* ── UI Language ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>UI Language</h2>
        <div className={styles.chipGroup}>
          {LANGUAGES.map(({ code, nativeName }) => (
            <button
              key={code}
              className={`${styles.langChip} ${i18n.language === code ? styles.chipActive : ""}`}
              onClick={() => i18n.changeLanguage(code)}
            >
              {nativeName}
            </button>
          ))}
        </div>
      </section>

      {/* ── Account & Security ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account &amp; Security</h2>
        {isGoogleOnly ? (
          <p className={styles.googleNote}>Connected with Google — no password set</p>
        ) : (
          <form className={styles.form} onSubmit={handlePasswordSave}>
            <h3 className={styles.subTitle}>Change password</h3>
            {PASSWORD_FIELDS.map(({ key, label }) => (
              <div className={styles.field} key={key}>
                <label className={styles.label}>{label}</label>
                <input
                  className={styles.input}
                  type="password"
                  value={pwForm[key]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <button className={styles.saveBtn} type="submit" disabled={pwSaving}>
              {pwSaving ? "Saving…" : "Change password"}
            </button>
          </form>
        )}
      </section>

      {/* ── Subscription ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription</h2>
        <div className={styles.subRow}>
          <span className={`${styles.planBadge} ${isPremium ? styles.planBadgePremium : ""}`}>
            {isPremium ? "Premium" : "Free"}
          </span>
          {sub?.current_period_end && (() => {
            const renewalDate = new Date(sub.current_period_end).toLocaleDateString();
            return (
              <span className={styles.subDetail}>
                {isPremium ? `Renews ${renewalDate}` : `Next billing: ${renewalDate}`}
              </span>
            );
          })()}
        </div>
        {isPremium ? (
          <button className={styles.manageBtn} onClick={handleManageSubscription}>
            Manage subscription
          </button>
        ) : (
          <button
            className={styles.upgradeBtn}
            onClick={() => handleUpgrade("monthly")}
            disabled={checkoutLoading !== null}
          >
            <Zap size={14} /> {checkoutLoading ? "Loading…" : "Upgrade to Premium"}
          </button>
        )}
      </section>

      {/* ── Danger Zone ── */}
      <section className={`${styles.section} ${styles.dangerSection}`}>
        <h2 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Danger Zone</h2>
        <p className={styles.dangerDesc}>
          Permanently delete your account and all your data. This cannot be undone.
        </p>
        <button className={styles.deleteBtn} onClick={handleOpenDeleteModal}>
          Delete account
        </button>
      </section>

      {/* ── Delete confirmation modal ── */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete account?</h3>
            <p className={styles.modalBody}>
              All your data — vocabulary, saved videos, and preferences — will be permanently deleted.
              This action cannot be undone.
            </p>
            {user?.auth_method !== "google" && (
              <div className={styles.modalPasswordField}>
                <label className={styles.modalPasswordLabel}>Confirm your password</label>
                <input
                  type="password"
                  className={styles.modalPasswordInput}
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  disabled={deleting}
                />
              </div>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={styles.modalDeleteBtn}
                onClick={handleDeleteAccount}
                disabled={deleting || (user?.auth_method !== "google" && !deletePassword)}
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
