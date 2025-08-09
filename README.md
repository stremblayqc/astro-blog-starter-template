# Astro Starter Kit: Blog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/astro-blog-starter-template)

![Astro Template Preview](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

<!-- dash-content-start -->

Create a blog with Astro and deploy it on Cloudflare Workers as a [static website](https://developers.cloudflare.com/workers/static-assets/).

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support
- ✅ Built-in Observability logging

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/astro-blog-starter-template
```

A live public deployment of this template is available at [https://astro-blog-starter-template.templates.workers.dev](https://astro-blog-starter-template.templates.workers.dev)

## 🚀 Project Structure

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.


## PROMPT

Goal
Build a date-sorted table of upcoming shows in the Montreal region (Montreal + Laval) filtered to my tastes.

Time window
- Start: when you run this (use America/Toronto local date/time).
- End: +6 months from start.
- Do NOT hardcode dates.

Sources (official only; no third-party aggregators)
- MTELUS, Beanfield Theatre, Club Soda, Le National, Foufounes Électriques, L’Olympia, Théâtre Fairmount, Bell Centre / Place Bell
- Promoters: evenko, Extensive Enterprise
Requirement: Visit each official site page. If a show isn’t on an official listing, exclude it.

Data to collect (per event)
- date_time_iso (ISO 8601 with local timezone)
- date_display (e.g., “Aug 27, 2025”)
- artists (array; parse titles like “X with Y / support Z” into separate names)
- headliner (string)
- venue (exact)
- city (Montreal or Laval)
- genre_raw (as listed)
- url (canonical event URL from the venue/promoter)
- blurb_raw (if available)

Normalization
- Deduplicate the same event across venue/promoter (same headliner + date + venue). Keep the venue page as canonical url when possible.
- Map genre_raw to one curated style label (see “Style mapping”).
- Exclude past or cancelled events.

Taste filter (keep MOST shows but remove obvious mismatches)
Keep if it fits any bucket below; remove only if clearly off-base:
- Rock/Metal core: classic rock 60s–90s; NWOBHM; doom/gothic; prog/alt; grunge; modern heavy (Ghost, Mastodon, Sleep Token, Spiritbox).
- Songwriters: Leonard Cohen, Bob Dylan, Joni Mitchell (and kindred).
- Americana/outlaw: e.g., Willie Nelson lineage.
- Indie/art rock: Radiohead, The National.
- Ambient/experimental: Brian Eno lineage.
- Jazz innovators: Miles, Coltrane lineage (modern innovators welcome).
- Scores/OST: John Williams, Howard Shore, select game OSTs.
- Québec-forward: proud of local scene (Harmonium, Offenbach, Jean Leloup, + Cohen/Joni/Neil/Rush).
Avoid: hype-cycle algorithmic pop, plastic EDM, “content farm” acts.

Style mapping (choose one label)
- Classic rock • NWOBHM • Doom/Gothic • Prog/Alt • Grunge • Modern heavy • Songwriter • Americana/Outlaw • Indie/Art rock • Ambient/Experimental • Jazz (innovator) • OST/Score • Québec iconic • Other-rock (only if none above fits)

Output
1) Produce HTML table ROWS ONLY (no header, no surrounding table) sorted ascending by date_time_iso. Each row must follow EXACTLY:
<tr>
  <td>{date_display}</td>
  <td>{artists joined with " + "}</td>
  <td>{venue}</td>
  <td>{style}</td>
  <td>{analysis}</td>
  <td><a href="{url}">link</a></td>
  <td>{album_suggestion}</td>
</tr>

2) Constraints for fields:
- date_display: “MMM DD, YYYY” (English month abbreviations).
- analysis: 6–12 words, crisp, no fluff; describe vibe (e.g., “Angsty shimmer with hooks—sad kids, loud hearts.”).
- album_suggestion: 1 seminal album to prep for the headliner (prefer a widely regarded classic; if new act, suggest their strongest or latest LP).
- style: exactly one from Style mapping.
- url: required; if missing, DO NOT include the event.

Quality & honesty rules
- Cite only events you found on official sources above. No guesses, no placeholders.
- If an artist matches only weakly, keep it (erring on inclusion) unless it’s clearly off-base per “Avoid”.
- If unsure about genre, infer from the artist’s best-known work, then choose the closest single style.
- If multiple nights, include each date as a separate row.

Example rows (format reference only; do not fabricate these):
<tr>
  <td>Aug 27, 2025</td>
  <td>Thousand Below + Aviana + True North + Dreamwake</td>
  <td>Théâtre Fairmount</td>
  <td>Modern heavy</td>
  <td>Angsty shimmer with hooks—sad kids, loud hearts.</td>
  <td><a href="https://example.com">link</a></td>
  <td>Thousand Below — Gone In Your Wake</td>
</tr>
<tr>
  <td>Aug 30, 2025</td>
  <td>Descendents + Buzzcocks + MattstaGraham</td>
  <td>MTELUS</td>
  <td>Other-rock</td>
  <td>Eternal caffeine; melody at 200 bpm.</td>
  <td><a href="https://example.com">link</a></td>
  <td>Descendents — Milo Goes to College</td>
</tr>

Final deliverable
- Output ONLY the <tr>…</tr> rows, ready to paste into my table.


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                           | Action                                           |
| :-------------------------------- | :----------------------------------------------- |
| `npm install`                     | Installs dependencies                            |
| `npm run dev`                     | Starts local dev server at `localhost:4321`      |
| `npm run build`                   | Build your production site to `./dist/`          |
| `npm run preview`                 | Preview your build locally, before deploying     |
| `npm run astro ...`               | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`         | Get help using the Astro CLI                     |
| `npm run build && npm run deploy` | Deploy your production site to Cloudflare        |
| `npm wrangler tail`               | View real-time logs for all Workers              |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
