import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import styles from "../../styles/PricingResult.module.css";

export const Route = createFileRoute("/pricing/success")({
  component: PricingSuccess,
});

function PricingSuccess() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <CheckCircle size={48} className={styles.icon} />
        <h1 className={styles.title}>Full access is ready</h1>
        <p className={styles.subtitle}>
          Languni is free for registered users. Enjoy the full app.
        </p>
        <Link to="/dashboard" className={styles.btn}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
