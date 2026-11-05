import Logo from "../components/Logo";
import { siteConfig } from "../data/site";
import "./Footer.css";
import { useI18n } from "../lib/i18n-store";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <Logo />
          <span className="label">{siteConfig.name}</span>
        </div>
        <p className="site-footer__legal label">
          © {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
