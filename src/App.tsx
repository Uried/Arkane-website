import SiteLayout from "./layouts/SiteLayout";
import { CartProvider } from "./lib/cart";
import ArticlePage from "./pages/ArticlePage";
import ArtistsPage from "./pages/ArtistsPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import DiscographyPage from "./pages/DiscographyPage";
import EditorialPage from "./pages/EditorialPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ShopPage from "./pages/ShopPage";

export default function App() {
  /* Minimal pathname switch — NavItem paths are plain hrefs; a real router
   * can replace this when the remaining sections come online. */
  const { pathname } = window.location;
  const editorialSlug = pathname.startsWith("/editorial/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";
  const shopSlug = pathname.startsWith("/shop/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";

  const page = pathname.startsWith("/artists") ? (
    <ArtistsPage />
  ) : pathname.startsWith("/releases") ? (
    <DiscographyPage />
  ) : pathname.startsWith("/contact") ? (
    <ContactPage />
  ) : pathname.startsWith("/editorial") ? (
    editorialSlug ? (
      <ArticlePage slug={editorialSlug} />
    ) : (
      <EditorialPage />
    )
  ) : pathname.startsWith("/shop") ? (
    shopSlug === "panier" ? (
      <CartPage />
    ) : shopSlug ? (
      <ProductPage slug={shopSlug} />
    ) : (
      <ShopPage />
    )
  ) : (
    <HomePage />
  );

  return (
    <CartProvider>
      <SiteLayout>{page}</SiteLayout>
    </CartProvider>
  );
}
