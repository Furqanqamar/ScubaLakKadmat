# Managing the island atlas

The Lakshadweep cards and all 15 island stories use one standalone page template.

- Edit names, summaries, facts, article sections, access notes, sources, related islands and shared interface copy in `src/app/data/island-guides.json`.
- Each `slug` creates `/lakshadweep/{slug}/`, including prerendered HTML, canonical metadata, Article/Place structured data and a sitemap entry. Keep published slugs stable.
- Each article section has a unique `id`, title and paragraph array. Never put HTML in this JSON; Angular renders the content as escaped text.
- Add a section’s optional `photo` key to show a photograph. The key resolves through `islandPhotograph()` in `src/app/data/island-guides.ts`. The three original owner photographs remain in the original-media catalogue.
- Artwork lives in `output/island-illustrations/`. The production website uses smaller, fingerprinted WebP variants, never the full PNG masters. Cards and hero use the same artwork without cropping its island shape.
- Licensed external photographs and credits are catalogued in `scripts/island-photos.json`. Only add images with a verified location and permission to reuse. Supply the creator, source and licence; keep the visible credit.
- Run `scripts/prepare-island-media.mjs` with Node and Sharp available when changing artwork/photos. Its generated manifest and `public/media/islands/` files are checked-in delivery assets; generation is not part of CI. Downloaded originals stay in ignored `tmp/island-photo-sources/`.
- Shared layout styles are in `src/styles/island-guides.css`, using colours and fonts from the existing central theme.

## Checks

Run `npm run build`, `node scripts/verify-island-guides.mjs`, `node scripts/verify-seo.mjs` and `node scripts/verify-image-assets.mjs`.

The atlas includes ten inhabited islands, Bangaram and Thinnakara, Suheli Par, Suheli’s Pitti sandbank and Pakshi Pitti Bird Island. Inclusion is not a claim that every place is open to visitors or operated by Scuba Lak. Suheli’s sandbank and Pakshi Pitti must stay distinct. Illustrations are labelled as stylised AI-created artwork and must not be described as current survey maps or real photographs.

Verified photographic coverage currently includes Kavaratti, Agatti, Amini, Kadmat, Kalpeni, Kiltan, Minicoy, Bangaram and Suheli Par. Andrott, Chetlat, Bitra, Thinnakara, Suheli Pitti and Pakshi Pitti await approved, correctly located photographs; their guides intentionally omit generic substitute photography.

Fingerprint caching covers new island images in the preview server and bounded, on-demand media cache. GitHub Pages controls its own HTTP cache headers; the site cannot override the host’s policy.
