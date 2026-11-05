import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "../components/Logo";
import { navItemsByLang, siteConfig } from "../data/site";
import { useCart } from "../lib/cart-store";
import { useI18n } from "../lib/i18n-store";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen } = useCart();
  const { lang, setLang, t } = useI18n();
  const nav = navItemsByLang[lang];

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a
          className="site-header__brand"
          href="/"
          aria-label={`${siteConfig.name} — ${nav[0]?.label ?? "home"}`}
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
          <span className="site-header__name">{siteConfig.shortName}</span>
        </a>

        <nav className="site-nav" aria-label={t("nav.main")}>
          <ul role="list" className="site-nav__list">
            {nav.map((item) => (
              <li key={item.path}>
                <a className="site-nav__link" href={item.path}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <div
            className="site-header__lang"
            role="group"
            aria-label={t("nav.lang.toggle")}
          >
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                className="site-header__lang-btn"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="site-header__cart-btn"
            aria-label={`${t("cart.aria")}, ${count} ${t("cart.articles")}`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="site-header__cart-badge" aria-hidden="true">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            className="site-header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={
              menuOpen ? t("nav.menu.close") : t("nav.menu.open")
            }
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label={t("nav.main")}
        hidden={!menuOpen}
      >
        <ul role="list" className="mobile-nav__list">
          {nav.map((item) => (
            <li key={item.path}>
              <a
                className="mobile-nav__link"
                href={item.path}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
