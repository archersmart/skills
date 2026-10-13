# Archer Skills

Agent skills tailored for Archer. Skills are small, easy to adapt, and composable. They work with any model.

## Installation

A plugin updates itself. [skills.sh](https://skills.sh/archersmart/skills) copies editable files into your project, and you update them by hand. Pick one per agent, because installing both gives you every skill twice. The canonical wording lives in [.agents/install-block.md](./.agents/install-block.md).

### Claude Code

```bash
claude plugin marketplace add archersmart/skills
claude plugin install archer-skills@archersmart
```

Updates itself when a release merges.

### Codex

```bash
codex plugin marketplace add archersmart/skills
codex plugin add archer-skills@archersmart
```

Updates itself at startup.

### GitHub Copilot (CLI and VS Code)

```bash
copilot plugin marketplace add archersmart/skills
copilot plugin install archer-skills@archersmart
```

Then, once, add to `~/.copilot/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "archersmart": { "source": { "source": "github", "repo": "archersmart/skills" }, "autoUpdate": true }
  }
}
```

### Every other agent (skills.sh)

```bash
npx skills@latest add archersmart/skills -a <agent>  # cursor, opencode, windsurf, amp; omit -a to choose
```

Manual updates: run `npx skills@latest update`, and re-run `add` to pick up new skills.

## The skills

Skills live in bucket folders under `skills/`. Only `engineering/` and `productivity/` are promoted: they ship in the plugin and get docs pages under `docs/`.

### Productivity

#### Model-invoked

- **[daily-report-generator](./skills/productivity/daily-report-generator/SKILL.md)**: Generate a Chinese standup report (早会日报) from completed tasks, git log, meeting notes, or todo items, using a fixed Markdown template, with optional publishing to Feishu.

### Buckets

- [engineering](./skills/engineering/README.md): daily code work
- [productivity](./skills/productivity/README.md): daily non-code workflow tools
- [in-progress](./skills/in-progress/README.md): beta, feedback wanted
- [misc](./skills/misc/README.md): kept around, rarely used
- [deprecated](./skills/deprecated/README.md): no longer used

## Developing this repo

The conventions (bucket rules, plugin manifest sync, docs pages, invocation modes, releases) live in [CLAUDE.md](./CLAUDE.md). Run `scripts/link-skills.sh` to symlink the skills into your local harnesses for daily use.
