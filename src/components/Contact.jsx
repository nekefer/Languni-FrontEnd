import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { sendContactMessage } from "../api/contact";
import ws from "../styles/Welcome.module.css";
import s from "../styles/Contact.module.css";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function Contact() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <PublicNavbar activePage="contact" />

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
      <PublicFooter />
    </div>
  );
}
