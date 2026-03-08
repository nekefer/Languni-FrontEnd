import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { createCheckout } from "../api/billing";
import config from "../config";
import styles from "../styles/UpgradeModal.module.css";

export function UpgradeModal({ onDismiss }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/register" });
      return;
    }
    const variantId = config.lsMonthlyVariantId;
    if (!variantId) return;
    try {
      setLoading(true);
      const checkoutUrl = await createCheckout(variantId);
      window.location.href = checkoutUrl;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrap}>
          <Zap size={28} />
        </div>
        <h2 className={styles.title}>Daily limit reached</h2>
        <p className={styles.body}>
          You've watched <strong>5 videos</strong> today on the free plan.
          Upgrade to Premium for unlimited access.
        </p>
        <div className={styles.features}>
          <span>Unlimited videos</span>
          <span>+5 trending/day</span>
          <span>Flashcards</span>
        </div>
        <button className={styles.upgradeBtn} onClick={handleUpgrade} disabled={loading}>
          {loading ? "Loading..." : "Upgrade to Premium — $5/mo"}
        </button>
        <button className={styles.dismissBtn} onClick={onDismiss}>
          Maybe tomorrow
        </button>
      </div>
    </div>
  );
}
