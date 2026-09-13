# Project Map: DuncanPersonalPage

_Last updated: 2026-09-12_

## Overview
- **Project Type**: Create React App (React 18) single-page personal website
- **Purpose**: Duncan's personal portfolio/blog site — retro/pixel-game-styled home landing page (with a nav-pill hero grid) that also gates access to an embedded Unity WebGL "world" for interactive navigation, plus Blog, Professional, Projects, Favorites (TV/Movies, Books/Podcasts, Restaurants), a Message contact form, and an unlinked `/admin` section (Google-auth-gated) for managing Firestore content. Content (blog posts, projects, favorites, messages) is stored in and fetched from Firestore.
- **Tech Stack**: React 18, react-router-dom v6 (HashRouter), Firebase (Firestore + Storage + Auth), Create React App / react-scripts 5, plain CSS (per-page stylesheets), pixelarticons (icon set, replacing devicon usage in nav) for UI icons, devicon (via CSS classes) still used for project-language icons

## Directory Structure (repo root: `duncanpersonalpage_localdev/`)
```
duncanpersonalpage_localdev/
├── .github/workflows/     — GitHub Actions CI (deploy.yml)
├── public/                — CRA static assets (icons referenced via process.env.PUBLIC_URL)
├── node_modules/          — (excluded from scan)
├── build/                 — build output (checked into working tree; gitignore status not re-verified)
├── src/
│   ├── components/        — Shared UI: Header, PixelFrame, PageBanner, NavGrid, PillFrame, NavIcons,
│   │   │                    StateOutline, Sidebar, BlogEntry, AdminNav, unityGame
│   ├── pages/
│   │   ├── mainpages/      — Top-level routed pages (Home, Blog, Professional, Projects, Favorites, MessageCenter)
│   │   ├── favoritessubpages/ — Favorites sub-pages (TV-Movies, Books-Podcasts, Restaurants)
│   │   └── adminpages/     — Unlinked /admin section: AdminAdd, AdminDelete, AdminMessages
│   ├── utils/              — Small `getImage`-style helpers per content type (project/restaurant/book/tv images)
│   ├── styles/             — One CSS file per page/component (no CSS-in-JS); includes Admin.css, PageBanner.css, PixelFrame.css, PixelInput.css, dataEntry.css
│   ├── favorites-images/   — Local static images grouped by category (book, tv, restaurant, project, other, files)
│   ├── firebase.js         — Firebase app init (Firestore + Storage + Auth/GoogleAuthProvider)
│   ├── App.js               — Router + route table; wraps non-admin routes in PixelFrame
│   └── index.js             — CRA entry point
```

**Sibling directories (outside this repo, same `DuncanPersonalPage/` parent folder):**
- `backup-site/` — a static build output (index.html + static assets) — not source, appears to be a snapshot/backup of a deployed build.
- `duncandataentrypage/` — separate small standalone vanilla JS/HTML utility (`index.html`, `main.js`, `delete.js`, `messages.html`, `messages.js`, `deletions.html`, `styles.css`) — looks like an admin/data-entry tool for managing Firestore content (messages/deletions), predates and appears to overlap with the in-app `/admin` pages now in `src/pages/adminpages/`.

## Key Files
- **package.json** — CRA app named `duncanpersonalpage`; homepage set to `https://duncanfbagley22.github.io/duncanpersonalpage`; scripts: `start`, `build`, `test`, `eject`; deps now include `pixelarticons` alongside `firebase` and `react-router-dom`
- **.github/workflows/deploy.yml** — On push to `main`: installs deps, `npm run build`, deploys `./build` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
- **src/firebase.js** — Initializes Firebase app, exports `app`, `db` (Firestore), `storage`, `auth`, `googleProvider` (Google sign-in for the admin section)
- **README.md** — Default, unmodified CRA boilerplate (no project-specific notes)

## Dependencies (grouped)
### UI / Routing
- react, react-dom (v18)
- react-router-dom (v6) — `HashRouter`
- pixelarticons — chunky pixel-style icon set used in `Header.js` (back arrow) and `NavIcons.js` (nav pill icons)

### Data / Backend
- firebase (v10) — Firestore (`projectData`, `blogData`, `messages` collections), Storage, and Auth (Google sign-in, admin section only)

### Dev tooling / Build
- react-scripts 5 (CRA)
- @testing-library/* (jest-dom, react, user-event) — default CRA test setup, not extended
- web-vitals

## Source Structure
- **App.js** — `HashRouter` with routes: `/`, `/blog`, `/professional`, `/projects`, `/favorites`, `/message`, `/books-podcasts`, `/tv-movies`, `/restaurants`, `/unity-game`, plus unlinked `/admin`, `/admin/delete`, `/admin/messages`. Admin routes render bare (`admin-route-content`); all other routes are wrapped in `PixelFrame` with `Header` as the frame header.
- **components/PixelFrame.js** — Retro console/cartridge-style chrome wrapper (side rails, footer) around page content; takes a `header` element and optional `headerInContent` flag.
- **components/Header.js** — Slimmed down: on non-home routes shows a back button (pixelarticons `ArrowLeft`, browser-history back) and a "Duncan Bagley" link back to `/`; renders nothing extra on Home. No longer includes a hamburger/dropdown menu.
- **components/NavGrid.js** — Shared nav-card grid (`NAV_ITEMS`: Home/Blog/Professional/Projects/Favorites/Message, each with a route, icon, and tint color). Renders each item as three layered pieces — `PillFrame` (SVG chrome), an icon badge, and a text label. Used as the large hero grid on Home; Home's tile intercepts navigation via `onHomeSelect` to show the instructions popup instead of routing directly.
- **components/PillFrame.js** — Inline SVG "sprite" for the nav pill chrome, styled after a Pokémon ORAS menu pill (pixelated silhouette, white-to-tint gradient body, separate hover-gradient overlay). Built as SVG rather than a PNG because binary image writes aren't available through the filesystem connection.
- **components/NavIcons.js** — Thin wrappers around `pixelarticons` icons (Home/Notebook/Briefcase/Tools/Star/Mail) for each nav item, using `currentColor` so they inherit the pill's color.
- **components/StateOutline.js** — Flanking Utah/North Carolina state-silhouette SVGs (public-domain-style boundary data, each state's flag pattern clipped inside) shown either side of the name banner on Home.
- **components/PageBanner.js** — Reusable retro-chrome page-title banner (title + optional subtitle) for use at the top of content pages.
- **components/AdminNav.js** — Header for the `/admin/*` section: tab links (Add/Delete/Messages) plus Google sign-in/out via Firebase Auth. Sign-in only identifies the user — no allowlist/role check yet, so access control still relies on Firestore security rules and the URL being unlinked/non-public.
- **pages/mainpages/Home.js** — Landing page: name/tagline banner flanked by `StateOutline`s, then the large `NavGrid`. Selecting the Home tile shows an instructions popup ("Start" button) before navigating to `/unity-game`; the old welcome copy is gone.
- **components/unityGame.js** — Embeds a Unity WebGL build via `<iframe src="https://duncanfbagley22.github.io/duncanPersonalPageUnity/">`. Simulates keyboard events into the iframe via `postMessage` so an on-screen D-pad (auto-shown on mobile via UA/viewport/touch sniffing) can drive the Unity game. Fairly involved custom logic — flag if modifying game controls.
- **pages/mainpages/Blog.js** — Fetches `blogData` collection from Firestore; `Sidebar` (search/date-filter) + `BlogEntry` detail view.
- **pages/mainpages/Projects.js** — Fetches `projectData` collection from Firestore; master-detail layout (list + detail panel on desktop, accordion on mobile) with an image carousel (`galleryimages`) and language icons (`devicon-<lang>-plain`) driven by each doc's `codinglanguages` field. Images resolved via `utils/getProjectImage.js` (`require`-based lookup into `favorites-images/project-images/`).
- **pages/mainpages/Favorites.js** — Static hub with 3 cards linking to `/tv-movies`, `/books-podcasts`, `/restaurants`.
- **pages/favoritessubpages/*.js** — TV-Movies, Books-Podcasts, Restaurants — each presumably Firestore-backed lists using their respective `utils/get*Image.js` helper (same pattern as Projects; not read in full).
- **pages/mainpages/MessageCenter.js** — Contact form writing to `messages` Firestore collection. Client-side validation: required fields, email regex, honeypot field for bot detection, and a 3-minute per-email rate limit (queries `messages` for recent submissions by the same email before allowing a new one).
- **pages/mainpages/Professional.js** — Not read in detail; presumably a static resume/experience page.
- **pages/adminpages/AdminAdd.js, AdminDelete.js, AdminMessages.js** — Not read in full; paired with `AdminNav` under the unlinked `/admin/*` routes for managing Firestore content (add/delete entries, view messages) directly from the deployed site instead of (or alongside) the separate `duncandataentrypage/` tool.
- **utils/get*Image.js** — Four near-identical helpers (`getProjectImage`, `getRestaurantImage`, `getBooksPodcastsImage`, `getTvMovieImage`), each just `require`-ing a filename from the matching `favorites-images/<category>-images/` folder.

## Entry Points
- `src/index.js` → mounts `<App />` → `App.js` route table (see above)
- Unity sub-app is a **separate** GitHub Pages–hosted build (`duncanfbagley22.github.io/duncanPersonalPageUnity`), embedded via iframe — not part of this repo's source or build.

## Configuration & Environment
- No `.env` file present in this scan; Firebase config in `src/firebase.js` is checked into source as plain JS object (standard for Firebase web client config — these values are public-facing by design, but confirm no server-side/admin secrets are ever added here).
- `homepage` field in `package.json` and the GH Actions deploy workflow together drive the GitHub Pages deployment (`gh-pages` branch, `duncanfbagley22.github.io/duncanpersonalpage`).
- CRA default `browserslist` and `eslintConfig` (react-app preset) — unmodified.

## Notable Patterns / Conventions
- **Routing**: `HashRouter`, not `BrowserRouter` — required for GitHub Pages hosting (no server-side rewrite support for client-side routes).
- **Firestore-as-CMS**: Blog, Projects, and (likely) the Favorites sub-pages all pull their content from Firestore collections rather than being hardcoded — content updates happen by editing Firestore data, not code. Both `duncandataentrypage/` (sibling folder) and the newer in-app `/admin/*` pages appear to serve this content-management role.
- **Image resolution pattern**: images referenced by Firestore documents are resolved locally via `require()` inside per-category `utils/get*Image.js` helpers, pointing into `src/favorites-images/<category>-images/` — new images must be added to that local folder, not just referenced by URL.
- **Retro/pixel design system**: `PixelFrame` (page chrome), `PageBanner` (page titles), `PillFrame` + `NavGrid` + `NavIcons` (nav pills), and `StateOutline` (decorative flanking icons) together form a cohesive 16/32-bit pixel-game aesthetic across Home and the page frame. Pill and state-outline art is hand-built inline SVG rather than raster images, because binary PNG writes aren't available through the filesystem connection used to edit this repo.
- **Admin access control is provisional**: `/admin/*` routes are unlinked from the main nav and gated only by Google sign-in (identity, not authorization) plus Firestore security rules — no in-app role/allowlist check yet.
- **Mobile handling is manual/ad hoc**: mobile detection is done via UA sniffing + viewport width + touch capability checks (see `unityGame.js`), and mobile-specific UI (accordion in Projects, D-pad in unityGame) is hand-built rather than using a shared responsive utility/hook.
- Several files have stray `console.log` debug statements left in (e.g., `App.js` logs `showUnityGame` on every render, `Projects.js`) and some commented-out dead code (carousel handlers in `Projects.js`) — candidates for cleanup.

## Notes
- Confirmed via a full scan of `src/**/*.js` that `DropdownMenu.js` (and `styles/DropdownMenu.css`) had no remaining importers after the header redesign; both were moved out of `src/` into `_removed/` at the repo root (this filesystem connection can't hard-delete files — `git rm -r _removed` or manual deletion will fully remove them).

## Open Questions / Gaps
- `Professional.js`, the three `favoritessubpages/*.js` files, and the three `adminpages/*.js` files were not read in full (their purpose is clear from name/location/import pattern but internals weren't verified).
- Relationship between `backup-site/` and the deployed `gh-pages` output isn't documented — worth confirming whether it's manually maintained or safe to delete/gitignore.
- `duncandataentrypage/` isn't in this repo's git tree or build, and now overlaps with the in-app `/admin/*` pages — worth deciding whether one should be retired in favor of the other.
- Admin routes currently rely on obscurity + Firestore rules for access control; worth deciding if/when a real allowlist or role check is needed.
