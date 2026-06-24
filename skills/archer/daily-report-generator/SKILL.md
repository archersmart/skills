---
name: daily-report-generator
description: Use when the user asks to write a daily standup report or daily work summary based on completed tasks, git log, meeting notes, or todo items
---

# Daily Report Generator

Generate a Chinese daily standup report (`早会日报`) using a fixed Markdown template.

## When to Use

- User says "写日报", "生成日报", "daily report", "standup report"
- User provides yesterday's completed items and today's plans
- User references git log, meeting notes, or Lark todo tasks as input
- User asks to publish the report to Feishu via `lark-cli`

## Template Structure

Always produce the report using the template in [TEMPLATE.md](TEMPLATE.md). The report has five fixed sections, named in everyday language (yesterday/today) so they read naturally:

| Section | Purpose |
|---------|---------|
| 昨日完成 | Yesterday's completed tasks (table) |
| 昨日小结 | 2-3 sentence summary of yesterday's accomplishments |
| 今日计划 | Today's planned tasks with P0/P1 priority (table) |
| 阻塞与风险 | Risks and dependencies that need support (table) |
| 备注 | Other notes |

The template uses two date formats by design:
- Report title uses `YYYY/MM/DD` (slash form, e.g. `2026/06/24`)
- Filename and footer use `YYYY-MM-DD` (dash form, e.g. `2026-06-24`)

## Rules

1. **Date in title**: Use the report's date (today) for the report title (`早会日报 — YYYY/MM/DD`).
2. **Yesterday = report date − 1**: The "昨日完成" and "昨日小结" sections cover the previous working day. The "今日计划" section covers the day of the report (what you will do today).
3. **Tables required**: Always include the three tables (昨日完成, 今日计划, 阻塞与风险) even if some rows are empty.
4. **Infer plans from context**: If the user does not provide today's plans, infer them from meeting notes, todo items, git log, or previous day's 今日计划.
5. **Risks realistic**: List 1-3 actual risks or dependencies based on the work described. Do not invent risks unrelated to the tasks.
6. **Keep Chinese**: Output the report in Chinese unless the user explicitly requests English.
7. **Save to file**: Write the report to `/Users/nongqingyang/workspace/archersmart/aps/docs/日报/早会日报-YYYY-MM-DD.md`.
8. **Publish option**: If the user asks to publish, run:
   ```bash
   cd /Users/nongqingyang/workspace/archersmart/aps/docs/日报 && \
   lark-cli docs +create \
     --api-version v2 \
     --as user \
     --doc-format markdown \
     --content "@./早会日报-YYYY-MM-DD.md" \
     --json
   ```

## Common Mistakes

- Do not omit the 昨日小结 section.
- Do not mix 昨日完成 and 今日计划 content (e.g., don't put today's plan in 昨日完成).
- Do not use bullet lists instead of tables for 昨日完成 / 今日计划 / 阻塞与风险.
