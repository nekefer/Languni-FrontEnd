import { useNavigate, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "../styles/NotFound.css";

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2>{t('notFound.title')}</h2>
        <p className="error-description">
          {t('notFound.desc')}
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
            {t('notFound.backToDashboard')}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            {t('notFound.goBack')}
          </button>
        </div>

        <div className="error-info">
          <p className="text-muted">
            {t('notFound.needHelp')} <a href="mailto:support@linguini.com">{t('notFound.contactSupport')}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
