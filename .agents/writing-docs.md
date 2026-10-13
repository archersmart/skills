# Writing docs pages

Every skill in `engineering/` and `productivity/` has a human-facing **docs page** at `docs/<bucket>/<skill-name>.md`. The docs tree mirrors those two bucket folders under `skills/`. The page is not the skill and not a copy of `SKILL.md`. Only these two buckets are promoted; the rest (`misc/`, `in-progress/`, `deprecated/`) ship no docs page.

Most skills are **user-invoked**: the agent will never fire them for you, so *you* are the index that has to remember they exist and when to reach for them. That memory is **cognitive load**. The job of a docs page is to relieve it: to orient one reader around one skill so they can hold it in their head, know when to reach for it, and see where it sits in the system.

Act whenever a promoted skill is added, renamed, or has its behaviour changed: create or re-sync its docs page. A rename moves the file too (`docs/<bucket>/<old>.md` to `docs/<bucket>/<new>.md`); a skill that moves between `engineering/` and `productivity/` moves its docs file to the matching folder. A skill moving *out* of a non-promoted bucket into `engineering/` or `productivity/` gains a page; one moving the other way loses it. A promoted skill that is removed outright keeps its page as an **archived** page: leave the body as it was and open it with a blockquote notice (`> **Archived.** ...`) naming the version it was removed in and any replacement.

## Page structure

Fill the template below, keeping its order. `## Prerequisites` and the free-form substance sections carry only what this particular skill needs; delete the rest.

Four sections make a page worth reading: `What it does`, `When to reach for it`, `Common questions`, `It's working if`. The first two orient the reader; the last two are where the page stops summarising the skill and starts answering the reader's own situation. Treat a page that clears neither of the last two as unfinished, not as finished-and-short.

<page-template>

## What it does

One or two plain-language paragraphs. Lead with the skill's one-sentence job, then state the **defining constraint**: the single fact that makes this skill behave differently from the obvious default. Write it as a plain declarative sentence, never a labelled aside like "The defining constraint:" or "The key thing:". This line is the most valuable on the page; never omit it.

## When to reach for it

How and when you reach for the skill, in two beats that are both effectively always present:

- **Invocation mode.** State whether you type it or the agent fires it. A user-invoked skill: "You invoke this by typing `/<name>`, and the agent won't reach for it on its own." A model-invoked skill: "Type `/<name>`, or the agent reaches for it automatically when a task fits."
- **Trigger boundary.** The index entry: "reach for this when ...". Where the skill is confusable with a sibling, add the other half: "for <X> instead, use `<sibling>`."

## Prerequisites

Optional: include only when the skill needs something in place to be functional; omit the heading entirely otherwise. Covers: a **workspace it writes into**, **prior setup**, or **repo-specific tooling**. A stateless skill that runs anywhere has no prerequisites, so drop the section.

## <free-form middle>

One to three short sections, in the skill's *own vocabulary*, that make it click. Choose whatever headings fit the skill: the loop it runs, the artifact it produces, the fork it makes, the one anti-pattern it kills.

The single non-negotiable: **surface the skill's leading word / defining idea**. It pays off twice: the reader learns what the skill *is*, and learns the word they'll later think with to *reach for* it.

## Common questions

The questions readers really ask about this skill, each in bold with the answer in the lines beneath it. No sub-headings.

An observed question always beats an invented one, so go and find them before you write any:

- **This repo's issues.** `gh issue list --repo archersmart/skills --search "<skill-name>" --state all`. A question filed twice is a question the page owes an answer to.
- **`CHANGELOG.md`.** Anything renamed, moved, or behaviourally changed generates a "where did it go?" that the page has to answer.

Where the hunt comes up thin, the section may also carry a question a reader would plainly ask, but **the count stays honest to the evidence**. A well-discussed skill earns six; an obscure one earns one or two, or none at all. Padding a thin skill out to match a rich one fills the section with questions nobody has. Omit the heading where there is nothing worth answering.

## It's working if

A few bullets naming what the reader sees when the skill is doing its job. The bar on each is that the reader can check it without opening `SKILL.md`: a signal in their own work, or in the trace in front of them. Include it wherever the tells are crisp; omit the heading where they stay vague.

## Where it fits

Always present. Situate the skill in the system in a sentence or two: its **role** (a chain step, a run-once setup, periodic maintenance, a reach-for-it-anytime standalone) and the one or two **neighbours** that matter, each with a because-clause.

</page-template>

## Conventions

- Explain the **why**, not the process. The page orients and situates the skill; it never reproduces the `SKILL.md` steps or template dumps.
- Use the skill's **leading words** so the page and the skill speak one language.
- **Branches go in a table or a list, never in a paragraph.** Where the page presents a choice, the reader is scanning for the one row that matches their situation.
- Keep the page itself low-load. It is documentation *about* low-cognitive-load skills; furniture (spare headings, restated links) is the thing it is arguing against.

## Done when

- The page exists at `docs/<bucket>/<name>.md`, and no stale page survives a rename or bucket move.
- `## What it does` states the defining constraint, as plain prose rather than a labelled aside.
- `## When to reach for it` states invocation mode and the trigger boundary.
- `## Where it fits` names the role.
- A prerequisite (workspace, prior setup, tooling) is stated where one exists, and the section is absent where none does.
- The middle surfaces the leading word.
- Every multi-way branch is a table or a list, not a paragraph the reader has to read in full.
- The hunt for real questions ran (the issues, the changelog), and `## Common questions` is sized to what it found, not padded.
- Every `## It's working if` bullet is checkable without opening `SKILL.md`.
- The sections appear in the template's order.
