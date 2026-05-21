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

Two standalone example apps demonstrate how to consume the library:

#### IDE Layout

A VS Code-style layout with a file explorer sidebar, draggable editor tabs, and a terminal panel. Dark theme.

```bash
cd examples/ide
pnpm dev
```

#### Dashboard

An analytics dashboard with stat cards, bar chart, donut chart, activity feed, and dynamic widget adding via the ref API. Light theme.

```bash
cd examples/dashboard
pnpm dev
```
