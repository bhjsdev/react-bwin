# Releasing

Publishing is driven by the **Publish to npm** workflow
(`.github/workflows/publish.yml`). It is triggered manually and reads the version from
`package.json`: a formal version (`X.Y.Z`) publishes under the `latest` dist-tag, a
pre-release (`X.Y.Z-dev.N`) under `dev`.

## Steps

1. **Bump the version** in `package.json` and merge it to `main`:

   ```bash
   npm version 0.3.4 --no-git-tag-version                 # formal
   npm version prepatch --preid=dev --no-git-tag-version  # dev pre-release
   ```

2. **Run the workflow** — Actions tab → **Publish to npm** → **Run workflow** on `main`.
   It fails if the `vX.Y.Z` tag already exists, so bump first.

3. **Approve** the `PUBLISH` environment gate. On approval the workflow builds, publishes
   to npm, pushes the `vX.Y.Z` tag, and (for formal releases) generates release notes.

## Reviewer's job

`pnpm publish` ships whatever `package.json` says, so before approving, confirm:

- the run targets `main` at the intended release commit;
- `package.json`'s `version` matches the version you mean to ship;
- routing is correct — `X.Y.Z` → `latest`, `X.Y.Z-dev.N` → `dev`.

Otherwise reject, fix `package.json`, and re-run.
