---
name: remember
description: Save decisions, research findings, and important context for future sessions. Use when the user runs /remember.
---

# Remember

Save decisions, research findings, and important context for future sessions.

## Instructions

When the user runs `/remember`, save the provided information to the persistent memory file at `memories.md` in the project root.

### Usage Patterns

1. **`/remember <text>`** - Save the provided text as a new memory entry
2. **`/remember`** (no args) - Show all saved memories

### Saving a Memory

When the user provides text to remember:

1. Read the current `memories.md` file (create it if it doesn't exist)
2. Append a new entry with a timestamp and the content
3. Confirm what was saved

#### Entry Format

Each entry should be appended as:

```markdown
### YYYY-MM-DD HH:MM - <short title>

**Confidence:** HIGH / MEDIUM / LOW
**Source:** <where this information came from — tool output, URL, user-provided, assumption>

<content provided by user>

---
```

Generate the short title (3-8 words) by summarizing the content. Use the current date/time for the timestamp.

When saving:
1. Assess confidence level based on evidence available
2. Note the source — if user provided it, say "User-provided". If from research, cite the source. If assumption, say "Assumption — needs verification"
3. Before appending, read existing memories and check for contradictions with the new entry. If found, flag: "NOTE: This conflicts with entry from [date] — [brief description of conflict]"

### Viewing Memories

When invoked with no arguments:

1. Read `memories.md`
2. Display all entries
3. Show total count

### Important Rules

- **Never delete or modify existing entries** when adding new ones - only append
- **Do not editorialize** - save what the user provides, not your interpretation
- Keep the file clean and readable
- The memories file is `memories.md` in the project root directory (`D:\Data Files\Project\Research\Montreal_Cigar_Club\memories.md`)
- If the file doesn't exist yet, create it with a header before adding the first entry

### Initial File Template

If creating `memories.md` for the first time:

```markdown
# Montreal Cigar Club Project Memories

Decisions, research findings, and notes saved across sessions.

---

```
