import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import styles from "../../styles/PricingResult.module.css";

export const Route = createFileRoute("/pricing/cancel")({
  component: PricingCancel,
});

function PricingCancel() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <XCircle size={48} className={`${styles.icon} ${styles.iconCancel}`} />
        <h1 className={styles.title}>No worries!</h1>
        <p className={styles.subtitle}>
          You can upgrade to Premium anytime from the pricing page.
        </p>
        <Link to="/dashboard" className={styles.btn}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
