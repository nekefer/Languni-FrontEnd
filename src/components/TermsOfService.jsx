import { Helmet } from "react-helmet-async";
import { Link } from "@tanstack/react-router";
import s from "../styles/LegalPage.module.css";
import languni from "../assets/Languni.webp";

export default function TermsOfService() {
  return (
    <div className={s.page}>
      <Helmet>
        <title>Terms of Service | Languni</title>
        <meta name="description" content="Read the terms and conditions for using Languni." />
        <link rel="canonical" href="https://languni.dev/terms" />
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
          <h1 className={s.title}>Terms of Service</h1>
          <p className={s.meta}>Last updated: March 2026</p>
        </div>

        <nav className={s.toc}>
          <p className={s.tocTitle}>Contents</p>
          <ol className={s.tocList}>
            <li><a href="#acceptance">Acceptance of Terms</a></li>
            <li><a href="#service">Description of Service</a></li>
            <li><a href="#accounts">Account Registration</a></li>
            <li><a href="#billing">Subscription & Billing</a></li>
            <li><a href="#free-tier">Free Tier Limitations</a></li>
            <li><a href="#acceptable-use">Acceptable Use</a></li>
            <li><a href="#youtube">YouTube Content</a></li>
            <li><a href="#ip">Intellectual Property</a></li>
            <li><a href="#termination">Termination</a></li>
            <li><a href="#disclaimer">Disclaimers</a></li>
            <li><a href="#liability">Limitation of Liability</a></li>
            <li><a href="#governing-law">Governing Law</a></li>
            <li><a href="#changes">Changes to Terms</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ol>
        </nav>

        <div className={s.highlight}>
          <p>
            Please read these Terms of Service carefully before using Languni.
            By creating an account or using the service, you agree to be bound by these terms.
          </p>
        </div>

        <div className={s.section} id="acceptance">
          <h2>1. Acceptance of Terms</h2>
          <p>These Terms of Service ("Terms") govern your access to and use of Languni ("the Service"), operated by Languni ("we", "us", "our"). By registering an account or using any part of the Service, you agree to these Terms. If you do not agree, do not use the Service.</p>
        </div>

        <div className={s.section} id="service">
          <h2>2. Description of Service</h2>
          <p>Languni is a language learning platform that helps users learn English, Spanish, and French through interactive YouTube videos. The Service provides features including:</p>
          <ul>
            <li>Browsing and watching YouTube videos with interactive subtitles</li>
            <li>Clicking words in subtitles to get definitions and translations</li>
            <li>Saving vocabulary words to a personal word bank</li>
            <li>Curated video recommendations based on language level and topics (Premium)</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.</p>
        </div>

        <div className={s.section} id="accounts">
          <h2>3. Account Registration</h2>
          <p>To use Languni, you must create an account using a valid email address or Google Sign-In. You are responsible for:</p>
          <ul>
            <li>Providing accurate registration information</li>
            <li>Keeping your password secure and confidential</li>
            <li>All activity that occurs under your account</li>
          </ul>
          <p>You must be at least 13 years old to create an account. One person may not maintain more than one free account.</p>
        </div>

        <div className={s.section} id="billing">
          <h2>4. Subscription & Billing</h2>
          <p>Languni offers a <strong>Free plan</strong> and a <strong>Premium plan</strong>. Premium subscriptions are available on a monthly ($5/month) or annual ($50/year) basis.</p>
          <p>All payments are processed securely by <strong>Lemon Squeezy</strong>. By subscribing, you authorise Lemon Squeezy to charge your payment method on a recurring basis.</p>
          <ul>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time from your Settings page. You will retain access to Premium features until the end of your current billing period.</li>
            <li><strong>Refunds:</strong> We offer refunds within 7 days of initial purchase if you are not satisfied. Contact us at <a href="mailto:support@languni.dev">support@languni.dev</a>.</li>
            <li><strong>Price changes:</strong> We will provide at least 30 days' notice before changing subscription prices.</li>
          </ul>
        </div>

        <div className={s.section} id="free-tier">
          <h2>5. Free Tier Limitations</h2>
          <p>The Free plan is limited to <strong>5 videos per day</strong>. We reserve the right to adjust free tier limits at any time. We will notify users of significant changes via email or in-app notice.</p>
        </div>

        <div className={s.section} id="acceptable-use">
          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to bypass, disable, or interfere with any security or rate-limiting features</li>
            <li>Scrape, crawl, or extract data from the Service in an automated manner</li>
            <li>Create multiple accounts to circumvent free tier limits</li>
            <li>Share, sell, or transfer your account to another person</li>
            <li>Reverse engineer any part of the Service</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
        </div>

        <div className={s.section} id="youtube">
          <h2>7. YouTube Content</h2>
          <p>Languni uses the <strong>YouTube Data API</strong> to surface video content. All videos displayed in the Service are hosted on and owned by YouTube and their respective creators. Languni does not host, own, or claim any rights over the video content.</p>
          <p>Your use of YouTube content through Languni is also subject to <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube's Terms of Service</a>. We are not responsible for the accuracy, legality, or appropriateness of any third-party video content.</p>
        </div>

        <div className={s.section} id="ip">
          <h2>8. Intellectual Property</h2>
          <p>The Languni name, logo, design, and original content (excluding YouTube videos) are the intellectual property of Languni. You may not copy, reproduce, or use them without our prior written permission.</p>
          <p>Your vocabulary data and learning preferences remain yours. We do not claim ownership over user-generated content.</p>
        </div>

        <div className={s.section} id="termination">
          <h2>9. Termination</h2>
          <p>You may delete your account at any time from the Settings page. Upon deletion, your personal data will be permanently removed within 30 days.</p>
          <p>We may suspend or terminate your account without notice if you violate these Terms, engage in fraudulent activity, or if we are required to do so by law. In such cases, no refund will be issued for any unused subscription period.</p>
        </div>

        <div className={s.section} id="disclaimer">
          <h2>10. Disclaimers</h2>
          <p>The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.</p>
          <p>Languni is a language learning tool, not a certified educational institution. We do not guarantee any specific learning outcomes.</p>
        </div>

        <div className={s.section} id="liability">
          <h2>11. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Languni shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of data or loss of profits.</p>
          <p>Our total liability to you for any claims arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </div>

        <div className={s.section} id="governing-law">
          <h2>12. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved through good-faith negotiation. If that fails, disputes shall be submitted to binding arbitration.</p>
        </div>

        <div className={s.section} id="changes">
          <h2>13. Changes to Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of material changes by email or via an in-app notice at least 14 days before the changes take effect. Your continued use of the Service after that date constitutes your acceptance of the updated Terms.</p>
        </div>

        <div className={s.section} id="contact">
          <h2>14. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:legal@languni.dev">legal@languni.dev</a>
          </p>
        </div>

        <hr className={s.divider} />

        <div className={s.footer}>
          <span className={s.footerNote}>© 2026 Languni. All rights reserved.</span>
          <div className={s.footerLinks}>
            <Link to="/">Home</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
