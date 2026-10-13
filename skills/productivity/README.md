# Productivity

Skills for daily non-code workflow tools.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

_None yet._

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[daily-report-generator](./daily-report-generator/SKILL.md)**: Generate a Chinese standup report (早会日报) from completed tasks, git log, meeting notes, or todo items, using a fixed Markdown template, with optional publishing to Feishu.
