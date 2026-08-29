---
name: verify
description: Fact-check claims, validate data, and detect hallucinations. Use when accuracy is critical or claims need verification.
---

# Verify

Fact-check claims, validate data, and detect potential hallucinations before presenting conclusions.

## Instructions

When the user runs `/verify`, or when you need to validate important claims, run this verification pipeline.

### Usage Patterns

1. **`/verify`** (no args) - Verify the most recent claims or conclusions in this session
2. **`/verify <claim>`** - Verify a specific claim or data point

### Verification Pipeline

Execute using the sequentialthinking MCP tool:

#### Step 1: Identify Claims (thought 1/5)
- List all factual claims made
- Categorize each as: technical fact, current state, historical fact, best practice, recommendation, price or legal/tax fact (cigar prices, tobacco tax, CBSA duty rules)
- Note the source of each claim (tool output, documentation, general knowledge, assumption)

#### Step 2: Evidence Check (thought 2/5)
For each claim:
- What evidence supports it? (tool output, source URL, documentation reference)
- Is the evidence current? (check dates, versions — especially for Claude API/model claims)
- Is the evidence from a primary source or secondary?
- Tag: VERIFIED / UNVERIFIED / ASSUMPTION

#### Step 3: Cross-Reference (thought 3/5)
For UNVERIFIED claims:
- Search for confirming or contradicting evidence (use WebSearch, fetch, file reads)
- Check at least 2 sources for critical claims
- For tax and duty claims, reference CBSA and Revenu Québec primary sources
- Note any contradictions found

#### Step 4: Impossibility & Consistency Check (thought 4/5)
- Are any values out of valid range? (percentages > 100, negative sizes, impossible dates)
- Do claims contradict each other?
- Do claims contradict known project context (from CLAUDE.md or memories)?
- Are there logical inconsistencies?

#### Step 5: Verdict (thought 5/5, nextThoughtNeeded: false)
For each claim, deliver:
- Status: VERIFIED / UNVERIFIED / CONTRADICTED / IMPOSSIBLE
- Evidence: what supports or contradicts it
- Confidence: HIGH / MEDIUM / LOW
- Action: ACCEPT / NEEDS RESEARCH / CORRECT / REMOVE

### Output Format

Present the verification report:

```
=== VERIFICATION REPORT ===

CLAIMS CHECKED: X

VERIFIED (HIGH confidence)
- <claim> — Source: <evidence>

UNVERIFIED (needs research)
- <claim> — Missing: <what's needed> — Research step: <how to verify>

CONTRADICTED
- <claim> — Contradicted by: <evidence> — Correction: <correct information>

IMPOSSIBLE
- <claim> — Why: <reason> — Correct range/value: <if known>

OVERALL RELIABILITY: [HIGH / MEDIUM / LOW]
===========================
```

### Important Rules

- ALWAYS use the sequentialthinking MCP tool — do not skip steps
- Be genuinely rigorous — the purpose is to catch errors, not confirm biases
- If verification requires web research, DO the research (use WebSearch/fetch) — don't just say "needs verification"
- Context: Montreal Cigar Club — cigar prices, domain and hosting costs, Quebec tobacco tax and CBSA duty-free rules, and retailer addresses are the highest-stakes claim categories
