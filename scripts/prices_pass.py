# -*- coding: utf-8 -*-
"""Insert estimated priceCents (FCFA cents) after each product's currency line.
PLACEHOLDER values to be replaced with real prices."""
import io, re

PATH = "src/data/products.ts"
prices = {
    "t-shirt-arkane": 800000,          # 8 000
    "hoodie-noir-arkane": 1500000,     # 15 000
    "hoodie-blanc-arkane": 1500000,    # 15 000
    "casquette-arkane": 600000,        # 6 000
    "tote-bag-arkane": 400000,         # 4 000
    "sac-bandouliere-arkane": 1200000, # 12 000
    "pack-stickers-arkane": 150000,    # 1 500
    "coffret-collector-dossier-noir": 3500000, # 35 000
    "vinyle-dossier-noir": 2500000,    # 25 000
    "collier-arkane-925": 4500000,     # 45 000
    "collier-dossier-noir": 2000000,   # 20 000
    "bague-arkane-signature": 4000000, # 40 000
}

s = io.open(PATH, encoding="utf-8").read()
for slug, cents in prices.items():
    pat = re.compile(r'(slug: "' + re.escape(slug) + r'"[\s\S]*?currency: "XAF",\n)')
    s, n = pat.subn(r"\g<1>    priceCents: " + str(cents) + ",\n", s, count=1)
    print(slug, "->", cents, "x" + str(n))
io.open(PATH, "w", encoding="utf-8").write(s)
