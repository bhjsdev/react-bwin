# CLAUDE.md

## Git rules

- **Never `git commit` or `git push` unless explicitly asked in that same message.** Approval doesn't carry over — ask each time.

## Testing

- Don't run tests or build after completing a feature or fixing a bug unless asked.

## Examples

- The `examples/` apps import `react-bwin` from the built `dist/`, not `src/`. After changing library source, run `pnpm build` before the examples reflect it. (The `dev/` app loads `src` directly and needs no rebuild.)