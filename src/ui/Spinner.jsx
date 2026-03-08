import { LoaderIcon } from "lucide-react";
import "./Spinner.css";

export function Spinner({ size = 16, className = "" }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={`spinner ${className}`}
      size={size}
    />
  );
}

export function FullPageSpinner({ text = "Loading..." }) {
  return (
    <div className="spinner-fullpage">
      <Spinner size={32} />
      <p>{text}</p>
    </div>
  );
}
