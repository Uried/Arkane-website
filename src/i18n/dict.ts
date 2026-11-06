/**
 * UI strings — bilingual dictionary. Keyed lookups via useI18n().t().
 * Content strings (news excerpts, artist names, release titles) stay in
 * their data files as LocalizedText or canonical values.
 */
import type { Lang } from "../types";

export const dict = {
  "page.home": { fr: "Accueil", en: "Home" },
  "page.artists": { fr: "Artistes", en: "Artists" },
  "page.releases": { fr: "Discographie", en: "Discography" },
  "page.news": { fr: "Actualités", en: "News" },
  "page.contact": { fr: "Contact", en: "Contact" },
  "page.shop": { fr: "Boutique", en: "Shop" },
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.artists": { fr: "Artistes", en: "Artists" },
  "nav.releases": { fr: "Sorties", en: "Releases" },
  "nav.editorial": { fr: "Journal", en: "Editorial" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.shop": { fr: "Boutique", en: "Shop" },
  "nav.menu.open": { fr: "Ouvrir le menu", en: "Open menu" },
  "nav.menu.close": { fr: "Fermer le menu", en: "Close menu" },
  "nav.lang.toggle": { fr: "Switch to English", en: "Passer en français" },
  "nav.main": { fr: "Navigation principale", en: "Main navigation" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },

  "action.all": { fr: "Tout", en: "All" },
  "action.search": { fr: "Rechercher", en: "Search" },
  "action.consult": { fr: "Consulter", en: "Read" },
  "action.send": { fr: "Envoyer", en: "Send" },
  "action.order": { fr: "Commander", en: "Order" },
  "action.close": { fr: "Fermer", en: "Close" },
  "action.back": { fr: "Retour", en: "Back" },
  "action.prev": { fr: "Précédent", en: "Previous" },
  "action.next": { fr: "Suivant", en: "Next" },

  "player.open": { fr: "Ouvrir", en: "Open" },
  "player.loading": { fr: "Chargement…", en: "Loading…" },
  "player.error": { fr: "Lecture impossible", en: "Playback unavailable" },
  "player.excerptSoon": { fr: "Extrait à venir", en: "Excerpt coming soon" },
  "player.playing": { fr: "En lecture", en: "Now playing" },

  "artists.search": { fr: "Rechercher un artiste", en: "Search an artist" },
  "artists.listen": { fr: "Écouter", en: "Listen" },
  "artists.noPlatforms": {
    fr: "Aucune plateforme renseignée pour le moment.",
    en: "No platforms listed yet.",
  },
  "artists.none": {
    fr: "Aucun artiste ne correspond à cette recherche.",
    en: "No artist matches this search.",
  },

  "releases.filter": {
    fr: "Filtrer par type de sortie",
    en: "Filter by release type",
  },
  "releases.search": { fr: "Rechercher une sortie", en: "Search a release" },
  "releases.catalog": { fr: "Catalogue", en: "Catalog" },
  "releases.empty": {
    fr: "Aucune sortie ne correspond à cette recherche.",
    en: "No release matches this search.",
  },
  "releases.yearLabel": { fr: "Sorties", en: "Releases" },

  "news.filter": {
    fr: "Filtrer par type de publication",
    en: "Filter by publication type",
  },
  "news.search": { fr: "Rechercher une actualité", en: "Search a news item" },
  "news.index": { fr: "Index des actualités", en: "News index" },
  "news.empty": {
    fr: "Aucune actualité publiée pour le moment.",
    en: "No news published yet.",
  },
  "news.emptySearch": {
    fr: "Aucune actualité ne correspond à cette recherche.",
    en: "No news matches this search.",
  },
  "news.back": { fr: "Actualités", en: "News" },
  "news.journal": { fr: "Journal", en: "Journal" },
  "news.missing": { fr: "Actualité introuvable.", en: "News item not found." },
  "news.missingNote": {
    fr: "Cette publication n'existe pas ou a été déplacée.",
    en: "This publication does not exist or has been moved.",
  },
  "news.adjacent": { fr: "Actualités voisines", en: "Adjacent news" },
  "news.carousel": { fr: "Actualités", en: "News" },
  "news.slideOf": { fr: "Actualité", en: "News item" },
  "news.pauseAuto": {
    fr: "Suspendre le défilement automatique",
    en: "Pause autoplay",
  },
  "news.playAuto": {
    fr: "Reprendre le défilement automatique",
    en: "Resume autoplay",
  },
  "news.pick": { fr: "Choisir une actualité", en: "Choose a news item" },

  "kind.sortie": { fr: "Sortie", en: "Release" },
  "kind.projet": { fr: "Projet", en: "Project" },
  "kind.artiste": { fr: "Artiste", en: "Artist" },
  "kind.label": { fr: "Label", en: "Label" },
  "kind.evenement": { fr: "Événement", en: "Event" },
  "kind.coulisses": { fr: "Coulisses", en: "Behind the scenes" },
  "kind.album": { fr: "Album", en: "Album" },
  "kind.ep": { fr: "EP", en: "EP" },
  "kind.single": { fr: "Single", en: "Single" },

  "contact.legend": { fr: "Nature de la demande", en: "Nature of the request" },
  "contact.kind.artiste": { fr: "Proposition artistique", en: "Artist proposal" },
  "contact.kind.partenariat": { fr: "Partenariat", en: "Partnership" },
  "contact.kind.production": { fr: "Production", en: "Production" },
  "contact.kind.general": { fr: "Question générale", en: "General question" },
  "contact.kind.autre": { fr: "Autre demande", en: "Other request" },
  "contact.write": { fr: "Écris-nous", en: "Write to us" },
  "contact.open": { fr: "Ouvrir un canal", en: "Open a channel" },
  "contact.name": { fr: "Nom", en: "Name" },
  "contact.email": { fr: "E-mail", en: "Email" },
  "contact.subject": { fr: "Sujet", en: "Subject" },
  "contact.message": { fr: "Message", en: "Message" },
  "contact.err.name": { fr: "Indique ton nom.", en: "Please enter your name." },
  "contact.err.email": {
    fr: "Adresse e-mail invalide.",
    en: "Invalid email address.",
  },
  "contact.err.subject": {
    fr: "Indique le sujet.",
    en: "Please enter a subject.",
  },
  "contact.err.message": {
    fr: "Message trop court (10 caractères minimum).",
    en: "Message too short (10 characters minimum).",
  },
  "contact.status.unavailable": {
    fr: "Le canal d'envoi sera bientôt disponible — ton message est prêt, réessaie plus tard.",
    en: "The sending channel will be available soon — your message is ready, try again later.",
  },
  "contact.status.sent": { fr: "Message envoyé.", en: "Message sent." },
  "contact.status.error": {
    fr: "Envoi impossible pour le moment — réessaie plus tard.",
    en: "Sending is not possible right now — try again later.",
  },
  "contact.direct": { fr: "Coordonnées directes", en: "Direct contact details" },
  "contact.soon": { fr: "À venir.", en: "Coming soon." },

  "shop.merch": { fr: "Merch", en: "Merch" },
  "shop.filter": { fr: "Filtrer par catégorie", en: "Filter by category" },
  "shop.empty": {
    fr: "La boutique ouvre bientôt — aucun produit n'est encore en ligne.",
    en: "The shop opens soon — no products online yet.",
  },
  "shop.emptyCat": {
    fr: "Aucun produit dans cette catégorie.",
    en: "No products in this category.",
  },
  "shop.soldOut": { fr: "Épuisé", en: "Sold out" },
  "shop.limited": { fr: "Limité", en: "Limited" },
  "shop.soon": { fr: "Bientôt disponible", en: "Coming soon" },
  "shop.option": { fr: "Option", en: "Option" },
  "shop.back": { fr: "Boutique", en: "Shop" },
  "shop.missing": { fr: "Produit introuvable.", en: "Product not found." },
  "shop.missingNote": {
    fr: "Ce produit n'existe pas ou a été retiré.",
    en: "This product does not exist or has been removed.",
  },
  "shop.add": { fr: "Ajouter au panier", en: "Add to cart" },
  "shop.collections": {
    fr: "Filtrer par collection",
    en: "Filter by collection",
  },
  "shop.discover": { fr: "Découvrir", en: "Discover" },
  "shop.gallery": { fr: "Galerie du produit", en: "Product gallery" },
  "shop.viewOf": { fr: "Vue", en: "View" },
  "shop.intro": {
    fr: "Les collections officielles du label — pièces signature et éditions limitées.",
    en: "The label's official collections — signature pieces and limited editions.",
  },

  "col.signature": { fr: "Arkane Signature", en: "Arkane Signature" },
  "col.limited": { fr: "Limited Editions", en: "Limited Editions" },

  "cat.vetement": { fr: "Vêtements", en: "Clothing" },
  "cat.accessoire": { fr: "Accessoires", en: "Accessories" },
  "cat.edition": { fr: "Éditions limitées", en: "Limited editions" },
  "cat.numerique": { fr: "Numérique", en: "Digital" },
  "cat.artiste": { fr: "Artistes", en: "Artists" },

  "cart.title": { fr: "Panier", en: "Cart" },
  "cart.empty": { fr: "Ton panier est vide.", en: "Your cart is empty." },
  "cart.subtotal": { fr: "Sous-total", en: "Subtotal" },
  "cart.note": {
    fr: "Livraison et paiement seront précisés à l'ouverture de la boutique.",
    en: "Delivery and payment details will be announced when the shop opens.",
  },
  "cart.unavailable": {
    fr: "Le canal de commande sera bientôt disponible — ton panier est conservé, réessaie plus tard.",
    en: "The order channel will be available soon — your cart is saved, try again later.",
  },
  "cart.view": { fr: "Voir le panier", en: "View cart" },
  "cart.decrease": { fr: "Réduire la quantité", en: "Decrease quantity" },
  "cart.increase": { fr: "Augmenter la quantité", en: "Increase quantity" },
  "cart.remove": { fr: "Retirer", en: "Remove" },
  "cart.aria": { fr: "Panier", en: "Cart" },
  "cart.articles": { fr: "article", en: "item" },
} as const satisfies Record<string, Record<Lang, string>>;

export type DictKey = keyof typeof dict;
