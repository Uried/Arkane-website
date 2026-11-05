# -*- coding: utf-8 -*-
"""One-off i18n conversion pass — injects useI18n + swaps hardcoded
French UI strings for t() lookups. Idempotent-ish: skips files already
wired."""
import io, re, os

SRC = os.path.join(os.path.dirname(__file__), "..", "src")

HOOK = "  const { t } = useI18n();\n"
IMP = 'import { useI18n } from "../lib/i18n";'
DIMP = 'import type { DictKey } from "../i18n/dict";'

def rd(rel):
    p = os.path.join(SRC, rel)
    return io.open(p, encoding="utf-8").read(), p

def wr(p, s):
    io.open(p, "w", encoding="utf-8").write(s)

def inject(rel, fn_name):
    s, p = rd(rel)
    if "useI18n" not in s:
        lines = s.split("\n")
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].startswith("import "):
                lines.insert(i + 1, IMP)
                break
        s = "\n".join(lines)
    if "useI18n()" not in s:
        pat = re.compile(r"(export default function " + re.escape(fn_name) + r"\([^)]*\) \{\n)")
        s = pat.sub(r"\g<1>" + HOOK, s, count=1)
    wr(p, s)

def dictkey_import(rel):
    s, p = rd(rel)
    if "DictKey" not in s:
        lines = s.split("\n")
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].startswith("import "):
                lines.insert(i + 1, DIMP)
                break
        s = "\n".join(lines)
    wr(p, s)

def rep(rel, pairs):
    s, p = rd(rel)
    for old, new in pairs:
        s = s.replace(old, new)
    wr(p, s)

report = {}

# ---------- Footer ----------
inject("layouts/Footer.tsx", "Footer")
rep("layouts/Footer.tsx", [
    ("© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.",
     '© {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}'),
])
report["Footer"] = "ok"

# ---------- HomeNews ----------
dictkey_import("components/HomeNews.tsx")
rep("components/HomeNews.tsx", [
    ("newsKindLabels, ", ""), (", newsKindLabels", ""),
])
inject("components/HomeNews.tsx", "HomeNews")
rep("components/HomeNews.tsx", [
    ('aria-label="Actualités"', 'aria-label={t("news.carousel")}'),
    ("Actualité {safeIndex + 1} sur {count} : {entry.title}",
     '{t("news.slideOf")} {safeIndex + 1} / {count} — {entry.title}'),
    ("newsKindLabels[entry.kind]", "t(`kind.${entry.kind}` as DictKey)"),
    ("              Consulter\n", '              {t("action.consult")}\n'),
    ('aria-label="Actualité précédente"', 'aria-label={t("action.prev")}'),
    ('aria-label="Actualité suivante"', 'aria-label={t("action.next")}'),
    ('aria-label="Choisir une actualité"', 'aria-label={t("news.pick")}'),
    ("`Actualité ${i + 1} — ${item.title}`", '`${t("news.slideOf")} ${i + 1} — ${item.title}`'),
    ('"Suspendre le défilement automatique"', 't("news.pauseAuto")'),
    ('"Reprendre le défilement automatique"', 't("news.playAuto")'),
])
report["HomeNews"] = "ok"

# ---------- ReleasePlayer ----------
inject("components/ReleasePlayer.tsx", "ReleasePlayer")
rep("components/ReleasePlayer.tsx", [
    ('"Extrait à venir"', 't("player.excerptSoon")'),
    ("              Lecture impossible", "              {t(\"player.error\")}"),
    ("`Ouvrir ${title} sur les plateformes d'écoute`", '`${t("player.open")} ${title}`'),
    ("            Ouvrir\n", '            {t("player.open")}\n'),
])
report["ReleasePlayer"] = "ok"

# ---------- EditorialPage ----------
dictkey_import("pages/EditorialPage.tsx")
inject("pages/EditorialPage.tsx", "EditorialPage")
rep("pages/EditorialPage.tsx", [
    ("`Actualités — ${siteConfig.name}`", '`${t("page.news")} — ${siteConfig.name}`'),
    ('{"Actualités".split("")', '{t("page.news").split("")'),
    ('aria-label="Index des actualités"', 'aria-label={t("news.index")}'),
    ('aria-label="Filtrer par type de publication"', 'aria-label={t("news.filter")}'),
    ("newsKindLabels[k]", "t(`kind.${k}` as DictKey)"),
    ("newsKindLabels[entry.kind]", "t(`kind.${entry.kind}` as DictKey)"),
    ("                  Tout\n", '                  {t("action.all")}\n'),
    ("                  Rechercher une actualité\n", '                  {t("news.search")}\n'),
    ('placeholder="Rechercher"', 'placeholder={t("action.search")}'),
    ('"Aucune actualité publiée pour le moment."', 't("news.empty")'),
    ('"Aucune actualité ne correspond à cette recherche."', 't("news.emptySearch")'),
    ('<span className="label">Journal</span>', '<span className="label">{t("news.journal")}</span>'),
])
report["EditorialPage"] = "ok"

# ---------- DiscographyPage ----------
dictkey_import("pages/DiscographyPage.tsx")
inject("pages/DiscographyPage.tsx", "DiscographyPage")
rep("pages/DiscographyPage.tsx", [
    ("`Discographie — ${siteConfig.name}`", '`${t("page.releases")} — ${siteConfig.name}`'),
    ('{"Discographie".split("")', '{t("page.releases").split("")'),
    ('<span className="label">Catalogue</span>', '<span className="label">{t("releases.catalog")}</span>'),
    ('aria-label="Catalogue des sorties"', 'aria-label={t("releases.catalog")}'),
    ('aria-label="Filtrer par type de sortie"', 'aria-label={t("releases.filter")}'),
    ("                Tout\n", '                {t("action.all")}\n'),
    ("kindLabels[k]", "t(`kind.${k}` as DictKey)"),
    ("kindLabels[release.kind]", "t(`kind.${release.kind}` as DictKey)"),
    ("Rechercher une sortie", '{t("releases.search")}'),
    ('placeholder="Rechercher"', 'placeholder={t("action.search")}'),
    ('"Aucune sortie ne correspond à cette recherche."', 't("releases.empty")'),
    ('`Sorties ${group.year}`', '`${t("releases.yearLabel")} ${group.year}`'),
    ('"Sorties"', 't("releases.yearLabel")'),
])
report["DiscographyPage"] = "ok"

# ---------- ArtistsPage ----------
dictkey_import("pages/ArtistsPage.tsx")
inject("pages/ArtistsPage.tsx", "ArtistsPage")
rep("pages/ArtistsPage.tsx", [
    ("`Artistes — ${siteConfig.name}`", '`${t("page.artists")} — ${siteConfig.name}`'),
    ('{"Artistes".split("")', '{t("page.artists").split("")'),
    ('"Extrait à venir"', 't("player.excerptSoon")'),
    ("            Écouter\n", '            {t("artists.listen")}\n'),
    ("`Lecture en cours — ${artist.name}`", '`${t("player.playing")} — ${artist.name}`'),
    ("Lecture impossible pour le moment", '{t("player.error")}'),
    ("Aucune plateforme renseignée pour le moment.", '{t("artists.noPlatforms")}'),
    ('placeholder="Rechercher"', 'placeholder={t("action.search")}'),
])
report["ArtistsPage"] = "ok"

# ---------- ContactPage ----------
dictkey_import("pages/ContactPage.tsx")
inject("pages/ContactPage.tsx", "ContactPage")
rep("pages/ContactPage.tsx", [
    ("`Contact — ${siteConfig.name}`", '`${t("page.contact")} — ${siteConfig.name}`'),
    ('{"Contact".split("")', '{t("page.contact").split("")'),
    ("Ouvrir un canal", '{t("contact.open")}'),
    ("              Nature de la demande", '              {t("contact.legend")}'),
    ("              Écris-nous", '              {t("contact.write")}'),
    ("{k.label}", "{t(`contact.kind.${k.id}` as DictKey)}"),
    ("{selectedKind.label}", "{t(`contact.kind.${kind}` as DictKey)}"),
    ("                    Nom\n", '                    {t("contact.name")}\n'),
    ("                    E-mail\n", '                    {t("contact.email")}\n'),
    ("                  Sujet\n", '                  {t("contact.subject")}\n'),
    ("                  Message\n", '                  {t("contact.message")}\n'),
    ("                  Envoyer", '                  {t("action.send")}'),
    ('                    Message envoyé.', '                    {t("contact.status.sent")}'),
    ("Coordonnées directes", '{t("contact.direct")}'),
    ("À venir.", '{t("contact.soon")}'),
])
report["ContactPage"] = "ok"

# ---------- contact.ts: error strings -> dict keys ----------
rep("lib/contact.ts", [
    ('errors.name = "Indique ton nom.";', 'errors.name = "contact.err.name";'),
    ('errors.email = "Adresse e-mail invalide.";', 'errors.email = "contact.err.email";'),
    ('errors.subject = "Indique le sujet.";', 'errors.subject = "contact.err.subject";'),
    ('errors.message = "Message trop court (10 caractères minimum).";',
     'errors.message = "contact.err.message";'),
])
report["contact.ts"] = "keys"

# ---------- ShopPage ----------
dictkey_import("pages/ShopPage.tsx")
rep("pages/ShopPage.tsx", [
    ("  categoryLabels,\n", ""), ("categoryLabels, ", ""), (", categoryLabels", ""),
])
inject("pages/ShopPage.tsx", "ShopPage")
rep("pages/ShopPage.tsx", [
    ("`Boutique — ${siteConfig.name}`", '`${t("page.shop")} — ${siteConfig.name}`'),
    ('{"Boutique".split("")', '{t("page.shop").split("")'),
    ('<span className="label">Merch</span>', '<span className="label">{t("shop.merch")}</span>'),
    ('aria-label="Filtrer par catégorie"', 'aria-label={t("shop.filter")}'),
    ("                Tout\n", '                {t("action.all")}\n'),
    ("categoryLabels[c]", "t(`cat.${c}` as DictKey)"),
    ('"La boutique ouvre bientôt — aucun produit n\'est encore en ligne."', 't("shop.empty")'),
    ('"Aucun produit dans cette catégorie."', 't("shop.emptyCat")'),
    ("Épuisé", '{t("shop.soldOut")}'),
    ("Limité", '{t("shop.limited")}'),
])
report["ShopPage"] = "ok"

# ---------- ProductPage ----------
dictkey_import("pages/ProductPage.tsx")
rep("pages/ProductPage.tsx", [
    ("categoryLabels, ", ""), (", categoryLabels", ""),
])
inject("pages/ProductPage.tsx", "ProductPage")
rep("pages/ProductPage.tsx", [
    ("`Produit introuvable — ${siteConfig.name}`", '`${t("shop.missing")} ${siteConfig.name}`'),
    ("            Boutique\n", '            {t("shop.back")}\n'),
    ("          Boutique\n", '          {t("shop.back")}\n'),
    ("            Produit introuvable.", '            {t("shop.missing")}'),
    ("Ce produit n'existe pas ou a été retiré.", '{t("shop.missingNote")}'),
    ("categoryLabels[product.category]", 't(`cat.${product.category}` as DictKey)'),
    ('<legend className="label">Option</legend>', '<legend className="label">{t("shop.option")}</legend>'),
    ("                  Ajouter au panier", '                  {t("shop.add")}'),
    ('{soldOut ? "Épuisé" : "Bientôt disponible"}', '{soldOut ? t("shop.soldOut") : t("shop.soon")}'),
])
report["ProductPage"] = "ok"

# ---------- CartPage ----------
dictkey_import("pages/CartPage.tsx")
inject("pages/CartPage.tsx", "CartPage")
rep("pages/CartPage.tsx", [
    ("`Panier — ${siteConfig.name}`", '`${t("cart.title")} — ${siteConfig.name}`'),
    ("          Boutique\n", '          {t("shop.back")}\n'),
    ('<h1 className="cart__title">Panier</h1>', '<h1 className="cart__title">{t("cart.title")}</h1>'),
    ("Ton panier est vide.", '{t("cart.empty")}'),
    ('<span className="label">Sous-total ({count})</span>', '<span className="label">{t("cart.subtotal")} ({count})</span>'),
    ("                Commander\n", '                {t("action.order")}\n'),
    ("`Réduire la quantité de ${product.name}`", '`${t("cart.decrease")} — ${product.name}`'),
    ("`Augmenter la quantité de ${product.name}`", '`${t("cart.increase")} — ${product.name}`'),
    ("`Retirer ${product.name} du panier`", '`${t("cart.remove")} ${product.name}`'),
])
report["CartPage"] = "ok"

# ---------- CartDrawer ----------
inject("components/CartDrawer.tsx", "CartDrawer")
rep("components/CartDrawer.tsx", [
    ('aria-label="Panier"', 'aria-label={t("cart.title")}'),
    ('aria-label="Fermer le panier"', 'aria-label={t("action.close")}'),
    ('aria-label="Fermer"', 'aria-label={t("action.close")}'),
    ("Ton panier est vide.", '{t("cart.empty")}'),
    ('aria-label="Réduire la quantité"', 'aria-label={t("cart.decrease")}'),
    ('aria-label="Augmenter la quantité"', 'aria-label={t("cart.increase")}'),
    ("`Retirer ${product.name}`", '`${t("cart.remove")} ${product.name}`'),
    ('<span className="label">Sous-total</span>', '<span className="label">{t("cart.subtotal")}</span>'),
    ("                  Voir le panier", '                  {t("cart.view")}'),
])
report["CartDrawer"] = "ok"

# ---------- ArticlePage ----------
dictkey_import("pages/ArticlePage.tsx")
rep("pages/ArticlePage.tsx", [
    ("newsKindLabels, ", ""), (", newsKindLabels", ""),
])
inject("pages/ArticlePage.tsx", "ArticlePage")
rep("pages/ArticlePage.tsx", [
    ("`Actualité introuvable — ${siteConfig.name}`", '`${t("news.missing")} ${siteConfig.name}`'),
    ("            Actualités\n", '            {t("news.back")}\n'),
    ("          Actualités\n", '          {t("news.back")}\n'),
    ("            Actualité introuvable.", '            {t("news.missing")}'),
    ("Cette publication n'existe pas ou a été déplacée.", '{t("news.missingNote")}'),
    ("newsKindLabels[article.kind]", 't(`kind.${article.kind}` as DictKey)'),
    ('aria-label="Actualités voisines"', 'aria-label={t("news.adjacent")}'),
    ('<span className="label">Précédent</span>', '<span className="label">{t("action.prev")}</span>'),
    ('<span className="label">Suivant</span>', '<span className="label">{t("action.next")}</span>'),
])
report["ArticlePage"] = "ok"

print(report)
