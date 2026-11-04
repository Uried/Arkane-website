import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "../components/Logo";
import { siteConfig } from "../data/site";
import { useCart } from "../lib/cart-store";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a
          className="site-header__brand"
          href="/"
          aria-label={`${siteConfig.name} — home`}
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
          <span className="site-header__name">{siteConfig.shortName}</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul role="list" className="site-nav__list">
            {siteConfig.nav.map((item) => (
              <li key={item.path}>
                <a className="site-nav__link" href={item.path}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="site-header__cart-btn"
          aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
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
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Mobile"
        hidden={!menuOpen}
      >
        <ul role="list" className="mobile-nav__list">
          {siteConfig.nav.map((item) => (
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
