import SiteLayout from "./layouts/SiteLayout";
import ArtistsPage from "./pages/ArtistsPage";
import HomePage from "./pages/HomePage";

export default function App() {
  /* Minimal pathname switch — NavItem paths are plain hrefs; a real router
   * can replace this when the remaining sections come online. */
  const page = window.location.pathname.startsWith("/artists") ? (
    <ArtistsPage />
  ) : (
    <HomePage />
  );

  return <SiteLayout>{page}</SiteLayout>;
}
