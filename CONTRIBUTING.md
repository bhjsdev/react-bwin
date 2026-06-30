# Contributing

## Development

```bash
pnpm install
pnpm dev
```

This starts the dev server with internal test pages at `http://localhost:5173`.

## Examples

See the `examples/` directory for standalone apps. They depend on the library's built
output, so build it first, then run an example (e.g. `dashboard`):

```bash
pnpm install
pnpm build
cd examples/dashboard
pnpm dev
```

## Developing against a local bwin

`react-bwin` consumes bwin's **built** output (`dist/bwin.js`). To develop both repos
together, see bwin's
[CONTRIBUTING](https://github.com/bhjsdev/bwin/blob/main/CONTRIBUTING.md#working-with-react-bwin)
for the link + watch workflow.

Note: bwin ships no types; keep the `src/bwin.d.ts` shim in sync when its API changes.
