# Changesets

This repo versions itself with [changesets](https://github.com/changesets/changesets).

- `npm run changeset` records a pending change (a markdown file in this folder).
- The Release workflow turns pending changesets into a "chore: version skills" PR.
- Merging that PR bumps `package.json` and `.claude-plugin/plugin.json` together (via `scripts/sync-plugin-version.mjs`) and tags the release, which is what makes plugin installs pick up the new version.
