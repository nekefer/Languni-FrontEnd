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
        <h1 className={styles.title}>No payment needed</h1>
        <p className={styles.subtitle}>
          Languni is free for registered users. Head back to your dashboard.
        </p>
        <Link to="/dashboard" className={styles.btn}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
