---
name: review
description: Expert self-critique of decisions, code changes, prompt designs, or plans before finalizing. Use when the user runs /review.
---

# Expert Review

Self-critique pipeline that forces structured adversarial review of decisions, code, prompt engineering, or plans before presenting them to the user. Uses sequential thinking to simulate a second expert opinion.

## Instructions

When the user runs `/review`, perform a rigorous multi-step self-critique of the most recent work, decision, or plan in the current session.

### Usage Patterns

1. **`/review`** (no args) - Review the most recent significant action, decision, or output in this session
2. **`/review <topic>`** - Review a specific topic, decision, or piece of work

### Review Pipeline

Execute the following sequential thinking chain using the sequentialthinking MCP tool. You MUST call the tool for each step - do not skip or internalize the thinking.

#### Step 1: Summarize What Was Done (thought 1/7)

Call sequentialthinking with thought 1 of 7. Summarize:
- What action was taken, decision was made, or output was produced
- What the stated goal or intent was
- What assumptions were made (explicit and implicit)

#### Step 2: Adversarial Challenge (thought 2/7)

Call sequentialthinking with thought 2 of 7. Act as a hostile reviewer:
- What could go wrong with this approach?
- What edge cases or failure modes were ignored?
- What would a skeptical expert challenge about this?
- Are there any logical flaws, oversights, or biases?

#### Step 3: Alternative Approaches (thought 3/7)

Call sequentialthinking with thought 3 of 7. Identify alternatives:
- What are 2-3 fundamentally different approaches that could solve the same problem?
- What are the trade-offs of each compared to the chosen approach?
- Is there an industry best practice that was overlooked?

#### Step 4: Risk Assessment (thought 4/7)

Call sequentialthinking with thought 4 of 7. Evaluate risks:
- Correctness (bugs, type errors, runtime failures — the project standard is zero runtime errors)
- Content accuracy (cigar facts, pricing, Quebec tobacco tax rules, brand consistency)
- Security (API key exposure, user data handling)
- Maintainability and impact on the co-development protocol with Antigravity
- Reversibility (can this be undone if it's wrong?)

#### Step 5: Evidence Check (thought 5/7)

Call sequentialthinking with thought 5 of 7. Verify factual basis:
- Are the claims accurate and verifiable?
- Were relevant sources consulted (retailer pages, registrar pricing, CBSA rules, browser output)?
- Did `npm run build` actually pass, or is that assumed?
- Are there any unverified assumptions that should be tested?

#### Step 6: Revision (thought 6/7, mark as is_revision=true)

Call sequentialthinking with thought 6 of 7, setting `isRevision: true`. Based on steps 2-5:
- What specific changes should be made to the original work?
- Which criticisms are valid and actionable?
- Which criticisms are theoretical and can be accepted as known risks?
- Produce a revised recommendation

#### Step 7: Final Verdict (thought 7/7)

Call sequentialthinking with thought 7 of 7, setting `nextThoughtNeeded: false`. Deliver:
- Confidence rating (HIGH / MEDIUM / LOW)
- Final recommendation (APPROVE / REVISE / REJECT)
- Summary of critical findings
- List of specific action items if any

### Output Format

After completing all 7 sequential thinking steps, present the user with a concise report:

```
=== EXPERT REVIEW ===

SUBJECT: <what was reviewed>

VERDICT: [APPROVE / REVISE / REJECT]
CONFIDENCE: [HIGH / MEDIUM / LOW]

STRENGTHS
---------
- <what was done well>

CRITICAL FINDINGS
-----------------
- <issues that must be addressed>

RISKS ACCEPTED
--------------
- <known risks deemed acceptable>

ALTERNATIVES CONSIDERED
-----------------------
- <brief summary of alternatives and why current approach holds or doesn't>

ACTION ITEMS
------------
[ ] <specific thing to fix/change, if any>
[ ] <specific thing to verify, if any>

========================
```

### Important Rules

- ALWAYS use the sequentialthinking MCP tool - do not fake the review by just writing text
- Be genuinely critical - the purpose is to catch mistakes, not rubber-stamp decisions
- If the review finds serious issues, say so clearly - do not soften findings
- If the work is genuinely good, say APPROVE with HIGH confidence - don't manufacture false criticisms
- Focus on practical, actionable findings over theoretical concerns
- Each thinking step should be substantive (at least 3-4 sentences), not superficial
- The review should take the context of the project into account (Montreal Cigar Club — luxury brand identity, static website, domain and hosting strategy, cigar sourcing research)

### Confidence Gating

After Step 7 verdict:

| Verdict + Confidence | Required Action |
|---------------------|-----------------|
| APPROVE + HIGH | Proceed. Output is ready. |
| APPROVE + MEDIUM | Proceed but explicitly list uncertainties and assumptions in output. |
| APPROVE + LOW | DO NOT proceed. Run /verify first, then re-review. |
| REVISE + any | Make the specific revisions identified. Re-review after changes. |
| REJECT + any | Stop. Explain why to user. Propose alternative approach. |

**Rule:** A LOW confidence APPROVE is equivalent to REVISE — the work is not ready.

### Mandatory Review Triggers

The /review skill should be invoked (by Claude, not just the user) when:
- Making a recommendation that could cause data loss, financial impact, or security exposure
- Changing the site architecture, hosting stack, or brand identity decisions
- Presenting conclusions based on research or analysis (not just tool output)
- The task involves multiple possible approaches and one was chosen
- Output will be saved to persistent memory
- The response is longer than ~500 words and contains factual claims

### Feedback Loop

After each review, save a one-line summary to memories.md:
```
### YYYY-MM-DD HH:MM - Review: <subject>
Verdict: <APPROVE/REVISE/REJECT> | Confidence: <HIGH/MEDIUM/LOW> | Key finding: <one sentence>
---
```

This builds a reviewable track record over time.
