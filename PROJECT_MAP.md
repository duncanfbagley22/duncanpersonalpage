# Project Map: DuncanPersonalPage

_Last updated: 2026-08-29_

## Overview
- **Project Type**: Create React App (React 18) single-page personal website
- **Purpose**: Duncan's personal portfolio/blog site — home landing page with an embedded Unity WebGL "world" for interactive navigation, plus Blog, Professional, Projects, Favorites (TV/Movies, Books/Podcasts, Restaurants), and a Message contact form. Content (blog posts, projects, favorites, messages) is stored in and fetched from Firestore.
- **Tech Stack**: React 18, react-router-dom v6 (HashRouter), Firebase (Firestore + Storage), Create React App / react-scripts 5, plain CSS (per-page stylesheets), devicon (via CSS classes) for language icons

## Directory Structure (repo root: `duncanpersonalpage_localdev/`)
```
duncanpersonalpage_localdev/
├── .github/workflows/     — GitHub Actions CI (deploy.yml)
├── public/                — CRA static assets (icons referenced via process.env.PUBLIC_URL)
├── node_modules/          — (excluded from scan)
├── src/
│   ├── components/        — Shared UI components (Header, Sidebar, DropdownMenu, BlogEntry, unityGame)
│   ├── pages/
│   │   ├── mainpages/      — Top-level routed pages (Home, Blog, Professional, Projects, Favorites, MessageCenter)
│   │   └── favoritessubpages/ — Favorites sub-pages (TV-Movies, Books-Podcasts, Restaurants)
│   ├── utils/              — Small `getImage`-style helpers per content type (project/restaurant/book/tv images)
│   ├── styles/             — One CSS file per page/component (no CSS-in-JS)
│   ├── favorites-images/   — Local static images grouped by category (book, tv, restaurant, project, other, files)
│   ├── firebase.js         — Firebase app init (Firestore + Storage)
│   ├── App.js               — Router + route table
│   └── index.js             — CRA entry point
```

**Sibling directories (outside this repo, same `DuncanPersonalPage/` parent folder):**
- `backup-site/` — a static build output (index.html + static assets) — not source, appears to be a snapshot/backup of a deployed build.
- `duncandataentrypage/` — separate small standalone vanilla JS/HTML utility (`index.html`, `main.js`, `delete.js`, `messages.html`, `messages.js`, `deletions.html`, `styles.css`) — looks like an admin/data-entry tool for managing Firestore content (messages/deletions), not part of the React app's build.

## Key Files
- **package.json** — CRA app named `duncanpersonalpage`; homepage set to `https://duncanfbagley22.github.io/duncanpersonalpage`; scripts: `start`, `build`, `test`, `eject`
- **.github/workflows/deploy.yml** — On push to `main`: installs deps, `npm run build`, deploys `./build` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
- **src/firebase.js** — Initializes Firebase app, exports `app`, `db` (Firestore), `storage`
- **README.md** — Default, unmodified CRA boilerplate (no project-specific notes)

## Dependencies (grouped)
### UI / Routing
- react, react-dom (v18)
- react-router-dom (v6) — `HashRouter`

### Data / Backend
- firebase (v10) — Firestore (`projectData`, `blogData`, `messages` collections) and Storage

### Dev tooling / Build
- react-scripts 5 (CRA)
- @testing-library/* (jest-dom, react, user-event) — default CRA test setup, not extended
- web-vitals

## Source Structure
- **App.js** — `HashRouter` with routes: `/`, `/blog`, `/professional`, `/projects`, `/favorites`, `/message`, `/books-podcasts`, `/tv-movies`, `/restaurants`, `/unity-game`. Renders `Header` on every route.
- **pages/mainpages/Home.js** — Landing page: intro text → instructions popup → navigates to `/unity-game`.
- **components/unityGame.js** — Embeds a Unity WebGL build via `<iframe src="https://duncanfbagley22.github.io/duncanPersonalPageUnity/">`. Simulates keyboard events into the iframe via `postMessage` so an on-screen D-pad (auto-shown on mobile via UA/viewport/touch sniffing) can drive the Unity game. Fairly involved custom logic — flag if modifying game controls.
- **pages/mainpages/Blog.js** — Fetches `blogData` collection from Firestore; `Sidebar` (search/date-filter) + `BlogEntry` detail view.
- **pages/mainpages/Projects.js** — Fetches `projectData` collection from Firestore; master-detail layout (list + detail panel on desktop, accordion on mobile) with an image carousel (`galleryimages`) and language icons (`devicon-<lang>-plain`) driven by each doc's `codinglanguages` field. Images resolved via `utils/getProjectImage.js` (`require`-based lookup into `favorites-images/project-images/`).
- **pages/mainpages/Favorites.js** — Static hub with 3 cards linking to `/tv-movies`, `/books-podcasts`, `/restaurants`.
- **pages/favoritessubpages/*.js** — TV-Movies, Books-Podcasts, Restaurants — each presumably Firestore-backed lists using their respective `utils/get*Image.js` helper (same pattern as Projects; not read in full).
- **pages/mainpages/MessageCenter.js** — Contact form writing to `messages` Firestore collection. Client-side validation: required fields, email regex, honeypot field for bot detection, and a 3-minute per-email rate limit (queries `messages` for recent submissions by the same email before allowing a new one).
- **pages/mainpages/Professional.js** — Not read in detail; presumably a static resume/experience page.
- **components/Header.js** — Top nav with a mobile hamburger toggle and a `DropdownMenu` (Favorites sub-links).
- **components/Sidebar.js** — Reusable search + date-range filter list, used by Blog.
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
- **Firestore-as-CMS**: Blog, Projects, and (likely) the Favorites sub-pages all pull their content from Firestore collections rather than being hardcoded — content updates happen by editing Firestore data, not code. `duncandataentrypage/` (sibling folder) appears to be the admin tool for managing at least the `messages` collection.
- **Image resolution pattern**: images referenced by Firestore documents are resolved locally via `require()` inside per-category `utils/get*Image.js` helpers, pointing into `src/favorites-images/<category>-images/` — new images must be added to that local folder, not just referenced by URL.
- **Mobile handling is manual/ad hoc**: mobile detection is done via UA sniffing + viewport width + touch capability checks (see `unityGame.js`), and mobile-specific UI (accordion in Projects, D-pad in unityGame, hamburger menu in Header) is hand-built rather than using a shared responsive utility/hook.
- Several files have stray `console.log` debug statements left in (e.g., `App.js`, `Projects.js`) and some commented-out dead code (carousel handlers in `Projects.js`) — candidates for cleanup.

## Open Questions / Gaps
- `Professional.js` and the three `favoritessubpages/*.js` files were not read in full (their purpose is clear from name/location/import pattern but internals weren't verified).
- Relationship between `backup-site/` and the deployed `gh-pages` output isn't documented — worth confirming whether it's manually maintained or safe to delete/gitignore.
- `duncandataentrypage/` isn't in this repo's git tree or build — worth deciding whether it should be folded into this repo, kept separate, or documented as a standalone admin tool.
