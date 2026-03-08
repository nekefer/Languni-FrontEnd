import styles from "../styles/PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  );
}
