import { Helmet } from "react-helmet-async";
import { Link } from "@tanstack/react-router";
import s from "../styles/LegalPage.module.css";
import languni from "../assets/Languni.webp";

export default function PrivacyPolicy() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>Privacy Policy | Languni</title>
        <meta name="description" content="Learn how Languni collects, uses, and protects your personal data." />
        <link rel="canonical" href="https://languni.dev/privacy" />
      </Helmet>

      <header className={s.header}>
        <Link to="/" className={s.logo}>
          <img src={languni} alt="Languni" width="108" height="28" />
        </Link>
        <Link to="/" className={s.backLink}>
          ← Back to home
        </Link>
      </header>

      <div className={s.container}>
        <div className={s.hero}>
          <span className={s.tag}>Legal</span>
          <h1 className={s.title}>Privacy Policy</h1>
          <p className={s.meta}>Last updated: March 2026</p>
        </div>

        <nav className={s.toc}>
          <p className={s.tocTitle}>Contents</p>
          <ol className={s.tocList}>
            <li><a href="#information">Information We Collect</a></li>
            <li><a href="#use">How We Use Your Information</a></li>
            <li><a href="#sharing">Sharing of Information</a></li>
            <li><a href="#third-parties">Third-Party Services</a></li>
            <li><a href="#cookies">Cookies & Tokens</a></li>
            <li><a href="#retention">Data Retention</a></li>
            <li><a href="#rights">Your Rights</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#children">Children's Privacy</a></li>
            <li><a href="#changes">Changes to This Policy</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ol>
        </nav>

        <div className={s.highlight}>
          <p>
            Languni ("we", "our", "us") is committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your rights regarding it.
            By using Languni, you agree to this policy.
          </p>
        </div>

        <div className={s.section} id="information">
          <h2>1. Information We Collect</h2>
          <p><strong>Account information:</strong> When you register, we collect your first name, last name, and email address.</p>
          <p><strong>Learning preferences:</strong> Your native language, target learning language, proficiency level, and topic interests — set during onboarding and editable in Settings.</p>
          <p><strong>Usage data:</strong> Videos you watch, words you click and save, and your vocabulary list.</p>
          <p><strong>Authentication data:</strong> If you sign in with Google, we receive your Google profile name, email address, and profile picture from Google's OAuth service.</p>
          <p><strong>Technical data:</strong> IP address, browser type, device type, and pages visited — collected automatically for security and analytics purposes.</p>
          <p><strong>Payment data:</strong> If you upgrade to Premium, payment is processed by Lemon Squeezy. We do not store your credit card details — only your subscription status and plan type.</p>
        </div>

        <div className={s.section} id="use">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To personalise video recommendations based on your language and level</li>
            <li>To save and display your vocabulary list</li>
            <li>To send transactional emails (email verification, password reset)</li>
            <li>To process subscription payments and manage your billing</li>
            <li>To analyse product usage and improve the app (via PostHog analytics)</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
          <p>We do not sell your personal data to any third party.</p>
        </div>

        <div className={s.section} id="sharing">
          <h2>3. Sharing of Information</h2>
          <p>We do not sell, rent, or trade your personal data. We only share data with the third-party service providers listed below, strictly to operate the service. Each provider is bound by their own privacy policies and data processing agreements.</p>
        </div>

        <div className={s.section} id="third-parties">
          <h2>4. Third-Party Services</h2>
          <ul>
            <li>
              <strong>Google OAuth & YouTube</strong> — We use Google Sign-In for authentication and the YouTube Data API to provide video content. Your use of these features is also subject to{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
            </li>
            <li>
              <strong>Lemon Squeezy</strong> — Handles all payment processing for Premium subscriptions. We receive only your subscription status. See their{" "}
              <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </li>
            <li>
              <strong>PostHog</strong> — Used for product analytics (feature usage, conversion tracking). Data is anonymised where possible and no sensitive data is passed. See their{" "}
              <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </li>
            <li>
              <strong>SendGrid</strong> — Used to send transactional emails (verification, password reset). See their{" "}
              <a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </li>
          </ul>
        </div>

        <div className={s.section} id="cookies">
          <h2>5. Cookies & Tokens</h2>
          <p>Languni uses <strong>HttpOnly cookies</strong> to store authentication tokens. These cookies are:</p>
          <ul>
            <li><strong>access_token</strong> — short-lived JWT used to authenticate your requests</li>
            <li><strong>refresh_token</strong> — longer-lived token used to renew your session</li>
          </ul>
          <p>These cookies are not accessible from JavaScript and are used solely for authentication. We do not use advertising cookies or tracking pixels.</p>
          <p>PostHog may set a cookie to identify your browser session for analytics. You can opt out of analytics tracking by contacting us.</p>
        </div>

        <div className={s.section} id="retention">
          <h2>6. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. If you delete your account, all personal data including your profile, learning preferences, and saved vocabulary is permanently deleted within 30 days.</p>
          <p>Anonymised usage analytics may be retained for longer periods to help us improve the product.</p>
        </div>

        <div className={s.section} id="rights">
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data via your Settings page</li>
            <li><strong>Deletion:</strong> Delete your account and all associated data from the Settings page</li>
            <li><strong>Portability:</strong> Request an export of your data</li>
            <li><strong>Objection:</strong> Object to certain types of data processing</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:privacy@languni.dev">privacy@languni.dev</a>.</p>
        </div>

        <div className={s.section} id="security">
          <h2>8. Security</h2>
          <p>We take security seriously. Authentication tokens are stored in HttpOnly cookies, passwords are hashed using industry-standard algorithms, and all data is transmitted over HTTPS. However, no system is completely secure, and we cannot guarantee absolute security.</p>
        </div>

        <div className={s.section} id="children">
          <h2>9. Children's Privacy</h2>
          <p>Languni is not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>
        </div>

        <div className={s.section} id="changes">
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top. For material changes, we'll notify you via email or an in-app notice. Your continued use of Languni after changes are posted constitutes your acceptance of the updated policy.</p>
        </div>

        <div className={s.section} id="contact">
          <h2>11. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please reach out to us:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:privacy@languni.dev">privacy@languni.dev</a>
          </p>
        </div>

        <hr className={s.divider} />

        <div className={s.footer}>
          <span className={s.footerNote}>© 2026 Languni. All rights reserved.</span>
          <div className={s.footerLinks}>
            <Link to="/">Home</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
