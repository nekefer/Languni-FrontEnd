import { useNavigate, useLocation } from "@tanstack/react-router";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p className="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {location.pathname && (
          <p className="error-path">
            <code>{location.pathname}</code>
          </p>
        )}

        <div className="error-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

        <div className="error-info">
          <p className="text-muted">
            Need help? <a href="mailto:support@linguini.com">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
