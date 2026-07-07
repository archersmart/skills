---
name: continue-session
description: Continue work from a previous session when context is full or you want to resume in a fresh session. Reads prior session JSONL transcripts, extracts key context, and produces a handoff brief so the new session can pick up seamlessly. Accepts session_id or session_name as arguments. Use when context window is nearly exhausted, when user says "继续上次的任务/会话", "resume", "handoff", "context满了", or when starting a new session and past work needs to be recovered.
argument-hint: "session_id or session_name (e.g. '百亚部署' or 'a2b34465')"
---

# Continue Session

Resume work from a prior session by extracting its transcript into a structured handoff brief.

## Arguments

The skill accepts an optional argument: a **session_id** (full or prefix) or **session_name** (substring of the session's AI-generated title).

| Arg type | Example | Behavior |
|----------|---------|----------|
| session_id | `a2b34465` | Find session by ID prefix match |
| session_name | `百亚部署` | Find session by title substring match |
| (empty) | — | List recent sessions for user to pick |

## Quick Start

1. **Find/list sessions** — if no argument given, list recent sessions (with session names):
   ```bash
   bash ~/.claude/skills/continue-session/scripts/find-sessions.sh
   # Output: aligned table with ID, Name, Last Modified, Size columns
   ```
   Or search by name/ID:
   ```bash
   bash find-sessions.sh --name "百亚"
   bash find-sessions.sh --id a2b34465
   ```

2. **Extract the transcript** — by ID, name, or direct path:
   ```bash
   node extract-session.js --id a2b34465 --compact --last 10
   node extract-session.js --name "百亚部署" --compact
   node extract-session.js <jsonl-path> --compact
   ```
   Flags: `--last N` (last N exchanges), `--full` (include tool results), `--compact` (trim for efficiency).

3. **Produce a handoff brief** — synthesize: Task → Completed → In Progress → Blockers → Next Steps → Key Files → Decisions

## Workflows

### A: Resume with Session ID/Name (most common)

User says: `继续上次的百亚任务` or `resume session a2b34465`

1. Resolve session: `node extract-session.js --name "百亚" --compact --last 10` or `--id <sid>`
2. Read transcript, synthesize handoff brief
3. Resume work, confirming understanding with user

### B: Context Full — Proactive Handoff

When context >80% and work isn't done:

1. Summarize current state (task, progress, decisions, modified files, blockers)
2. Save brief: `mktemp -t handoff-XXXXXX.md`
3. Tell user: "Context is full. Handoff brief at `<path>`. New session: `读取交接文件 <path> 继续任务`"

### C: Pick from Recent Sessions

No argument given → list sessions, user picks one, then follow Workflow A.

## Handoff Brief Template

```markdown
# Handoff Brief
## Task
<One-line description>
## Completed
- <What was done>
## In Progress
- <What was being worked on when context ran out>
## Blockers
- <Unresolved issues or errors>
## Next Steps
1. <Concrete next action>
## Key Files
- `<file-path>` — <what was being done>
## Decisions & Constraints
- <Important decisions made>
## Skills Used
- <Skills invoked>
```

## Notes

- Session files: `~/.claude/projects/<escaped-project-path>/<uuid>.jsonl`
- Project path escaped by replacing `/` with `-`
- `--compact` skips tool_result/file-history-snapshot/attachment messages
