# ADR 0001: Ship as a Claude Code plugin

## Status

Accepted

## Context

The skills in this repo need to reach several agent harnesses (Claude Code, Codex, Copilot, and others), and installs should update themselves where the harness supports it. Copy-based installs (skills.sh and friends) go stale the moment they land.

## Decision

Ship the repo as a Claude Code plugin: `.claude-plugin/plugin.json` declares the promoted skill set (`engineering/` and `productivity/`, exactly the `skills` array), and `.claude-plugin/marketplace.json` makes the repo itself an installable marketplace. Harnesses with plugin support install from the marketplace and update when `plugin.json`'s `version` changes; everything else falls back to skills.sh, labelled "manual updates".

Releases run on changesets: the Release workflow opens a "chore: version skills" PR, and merging it bumps `package.json` and `plugin.json` together via `scripts/sync-plugin-version.mjs`, then tags.

## Consequences

- Every promoted skill must stay registered in `plugin.json`'s `skills` array; non-promoted buckets must never appear there.
- Manifest edits are validated with `claude plugin validate . --strict`.
- Install wording is canonical in `.agents/install-block.md`; `README.md` copies it verbatim.
- Releasing requires npm tooling (`npm install` once, then the changesets flow), even though the repo ships no JavaScript.
