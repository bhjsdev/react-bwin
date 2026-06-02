## React Binary Window

A React-based tiling window manager featuring resizable panes, drag-and-drop, and more. Built on top of the [Binary Window](https://github.com/bhjsdev/bwin) library.

[Documentation](https://bhjsdev.github.io/bwin-docs/)

### Development

```bash
pnpm install
pnpm dev
```

This starts the dev server with internal test pages at `http://localhost:5173`.

### Examples

See the `examples/` directory for standalone apps. They depend on the library's built
output, so build it first, then run an example (e.g. `dashboard`):

```bash
pnpm install
pnpm build
cd examples/dashboard
pnpm dev
```
