import Logo from "../components/Logo";
import { siteConfig } from "../data/site";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <Logo />
          <span className="label">{siteConfig.name}</span>
        </div>
        <p className="site-footer__legal label">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
