import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface SiteLayoutProps {
  children: ReactNode;
}

/**
 * Application shell — header, main landmark, footer.
 * When routing is introduced, pages mount inside <SiteLayout>.
 */
export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
