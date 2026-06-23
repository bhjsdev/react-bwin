# CLAUDE.md

Operational rules for working in this repo. `react-bwin` is the React binding for the
`bwin` window-tiling library and mirrors its features; the conventions below are
inherited from `bwin` and apply when writing or reviewing source here.

## Git

- **Never `git commit` or `git push` unless the user explicitly asks for it in that same turn.** Approval never carries over between turns — ask every time.
  - A request to "create a PR", "fix this", or a shared error message is **not** authorization to commit or push. Do the work, then ask before committing (e.g. "Want me to commit and push?").
  - Only an explicit yes/instruction in the current turn counts. When in doubt, ask.
- When committing, print the commit message in your reply.
- **No Claude attribution trailers** — never add `Co-Authored-By: Claude` or `Generated with Claude Code` (or similar) to commit messages or PR descriptions.
- Type commits that only touch `dev/` as plain `chore:` — never `feat:`/`fix:`, no `(dev)` scope. It's test scaffolding, not library source.

## Testing

- Don't run tests or builds after finishing a feature or fix unless asked.

## Examples & dev

- The `examples/` apps import `react-bwin` from the built `dist/`, not `src/`. After changing library source, run `pnpm build` before the examples reflect it.
- The `dev/` app loads `src` directly and needs no rebuild.

## Terminology

- Use the window-construction metaphor precisely (sash / pane / muntin / glass). Don't pick a name whose well-known meaning differs from what the code does.
- Use plain "glass" by default; say "attached glass" only when contrasting with "detached glass". A **windowless glass** is a detached glass with no owning window (floats on `document.body`) — use that exact term, not "free glass" (the old name) or "floating glass".

## Naming

- **DOM-element variables get an `El` suffix with a _specific_ noun** — `activeGlassEl`, not `activeEl`, and not a vague `glassEl` when more specificity is available.
- **Element accessors are named `get<Noun>`** — e.g. `getActiveDetachedGlass`.
- **Constants name the context they apply to, not just the quantity** — `MIN_RESIZE_WIDTH`, not `MIN_WIDTH`.
- **Prefer established domain/library terms** and match their conventional meaning.
- **Stash data on DOM elements with an _attribute_ by default; reach for a `bw`-prefixed expando property only when the value can't serialize to a string** (an element reference or structured object) **or joins a cluster of related `bwXxx` props** on the same element. A standalone primitive belongs in an attribute so it's namespaced, inspectable, and query-selectable.
- **Custom HTML attributes are `bw-`-prefixed only on native elements** (`<button bw-plant="glass">`). Do **not** prefix attributes on bwin's own custom elements (`<bw-pane>`, `<bw-glass>`, …) — the element name already carries the `bw-` namespace, so plain attributes like `position`, `sash-id`, `maximized`, `detached` stay unprefixed.

**Why:** self-documenting names — a reader should know what a variable holds and where a constant applies without chasing its definition.

## Comments

- **Comment only when it adds something the code doesn't already say.** No restating the obvious.
- **Keep comments terse: ≤2 lines, ≤100 chars per line.** If one genuinely must run longer, prefix it with `RATIONAL:` so the length is clearly deliberate.
- **Wrap code keywords in backticks** — API/method names, variable names, identifiers (e.g. `` `addPane` ``).

## Debug sentinel values

Repeating-digit literals like `222`, `333`, `444` in default/fallback paths are **intentional debug sentinels, not magic numbers**. They mark a guard that should have supplied a real value.

- **Don't rename them to constants or "tidy" them away.**
- If one surfaces downstream (in a lower-level API or the rendered output), a guard upstream was bypassed — investigate that, don't replace the sentinel.

## bwin coupling

React must own DOM creation, but bwin's `mount()` creates DOM itself — so the wrapper bypasses `mount()` and reaches into bwin internals. These are the coupling points; if bwin renames/restructures any of them, react-bwin breaks and must be updated in lockstep:

- **Skips `mount()`** — sets `bwin.windowElement` / `containerElement` / `sillElement` from refs, then calls `bwin.enableFeatures()` directly (`Window.tsx`).
- **Walks the sash tree** — `bwin.rootSash.walk(...)` using `children` / `leftChild` / `topChild` to render panes vs muntins itself.
- **Mutates `sash.domNode`** — set from React refs after render (`Pane.tsx`, `Muntin.tsx`).
- **Reads `sash.store.*`** — `actions`, `title`, `content`, `droppable`, `draggable`, `resizable`. The `store` bag is the integration contract.
- **Re-implements the actions default inline** — the `actions === undefined ? DEFAULT_GLASS_ACTIONS : Array.isArray(...) ? ... : []` logic is duplicated from bwin and **must be kept in sync by hand**; the `undefined`-vs-`null` distinction is load-bearing.
- **Duplicates muntin geometry** — `Muntin.tsx` hardcodes `MUNTIN_SIZE = 4` to match bwin's internal divider size.
- **Hand-maintained types** — `src/bwin.d.ts` shims `declare module 'bwin'` because bwin publishes no types.

Version drift is expected: react-bwin's `package.json` may pin an older `bwin` than core.

## Dev pages (`dev/`)

- Treat `dev/` as test scaffolding for manually exercising features/bugs, not shippable library source. (Unlike bwin's `.html`+`.js` split, these are `.tsx` React components with inline JSX controls.)
- Commits that only touch `dev/` are plain `chore:` (see Git above).
