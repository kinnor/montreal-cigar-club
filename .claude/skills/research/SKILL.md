---
name: research
description: Research cigars, Montreal/Quebec sourcing and tax rules, domains/hosting, events and audio gear with sources and confidence levels. Use when the user runs /research.
---

# Research

Research topics relevant to the Montreal Cigar Club: cigar profiles and ratings, Canadian/Quebec sourcing and pricing, tobacco tax and CBSA duty rules, domain/hosting options, event logistics, and audio gear.

## Instructions

When the user runs `/research`, gather evidence using WebSearch, the fetch MCP server, and file reads — never answer research questions from memory alone.

### Usage Patterns

1. **`/research <topic>`** - Research a specific topic (e.g., "Padrón 1964 Principe price Canada", "Quebec tobacco tax on cigars", ".ca domain pricing Porkbun")
2. **`/research verify <claim>`** - Fact-check a specific claim (e.g., a price or rule already in `README.md`)
3. **`/research venues`** - Survey Montreal cigar lounges, retailers, and event-friendly venues

### Research Process

1. Use web search and fetch tools to gather information from multiple sources
2. Cross-reference at least 2 sources for critical claims (prices, legal rules)
3. Summarize findings with source attribution
4. Save key findings to memory (`/remember` or memory MCP) for future sessions
5. Present results clearly with links to sources; update `README.md` only when the user confirms

### Evidence Standards

Every research finding must include:
1. **Source** — URL, document name, or tool that provided the information
2. **Date** — when the source was published or last updated (if available)
3. **Confidence** — HIGH (primary source, e.g., CBSA, Revenu Québec, a retailer's own page), MEDIUM (reputable secondary source), LOW (single unverified source / forum)
4. **Cross-reference** — for prices and legal/tax claims, minimum 2 independent sources required

### Domain-Specific Sources

- **Cigar ratings:** Cigar Aficionado, Halfwheel, manufacturer pages
- **Canadian pricing:** Cigar Chief, Montreal retailers (Vasco, Blatter & Blatter) — prices change often, always date them
- **Duty / tax rules:** CBSA (personal exemptions), Revenu Québec (tobacco tax) — primary sources only
- **Domains / hosting:** registrar pricing pages (Porkbun, Namecheap), Cloudflare Pages docs
- **Audio gear:** manufacturer specs + independent reviews (e.g., RTINGS)

### Staleness Detection

- Prices, availability, tax rates: sources older than ~6 months need re-verification
- Cigar blend/rating facts: older sources acceptable
- If stale, note: "Source is from [date] — may be outdated. Recommend verification."

### Contradiction Handling

When sources disagree:
- Present ALL versions with their sources
- Do NOT pick one and suppress the others
- Note which source is more authoritative and why
- If unresolvable, state: "Conflicting information — requires further verification"

### Important Rules

- Always cite sources for research findings
- Distinguish verified facts from opinions and marketing claims
- Flag any claims that cannot be independently verified
