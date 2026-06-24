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
