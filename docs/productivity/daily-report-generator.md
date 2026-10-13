# Daily Report Generator

## What it does

Generates a Chinese standup report (早会日报) as a Markdown file, built from whatever you give it: completed tasks, git log, meeting notes, or todo items. The output always follows a fixed five-section template (昨日完成, 昨日小结, 今日计划, 阻塞与风险, 备注), and the three list sections are always tables, even when some rows stay empty.

## When to reach for it

Type `/daily-report-generator`, or the agent reaches for it automatically when a task fits: "写日报", "生成日报", "daily report", "standup report", or any request to summarize yesterday's work and today's plans.

## Prerequisites

Generating the file needs nothing. Publishing the report to Feishu needs `lark-cli` installed and authenticated; the skill only attempts that when you ask it to publish.

## The date arithmetic

The report date defaults to today. The 昨日完成 and 昨日小结 sections cover the day *before* the report date; 今日计划 covers the report date itself. Two date formats are deliberate: the report title uses `YYYY/MM/DD` (slashes), while the filename and footer use `YYYY-MM-DD` (dashes). The file lands at `${DAILY_REPORT_DIR:-.}/早会日报-<YYYY-MM-DD>.md`, so set `DAILY_REPORT_DIR` if you want reports in a fixed directory instead of the current working directory.

## Common questions

**Where does the report file go?**

Into the current working directory by default. Set the `DAILY_REPORT_DIR` environment variable to redirect it.

**What if I don't give it today's plan?**

The skill infers 今日计划 from context: meeting notes, todo items, git log, or the previous report's plan section. Risks are listed only when they follow from the work described; it does not invent them.

## It's working if

- A file named `早会日报-<today>.md` appears in `DAILY_REPORT_DIR` (or the working directory).
- All three tables (昨日完成, 今日计划, 阻塞与风险) are present, even with empty rows.
- The title date uses slashes and the filename uses dashes.
- The report is in Chinese unless you asked for English.

## Where it fits

A reach-for-it-anytime standalone, currently the only promoted skill in this repo. It writes a file and optionally publishes it; it does not feed into any larger flow.
