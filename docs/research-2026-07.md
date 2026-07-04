# Token Efficiency: Research Landscape, Harness Mechanisms, and Skill Update Recommendations

Compiled July 2026. Three questions: (1) what research exists on token efficiency for
tool-using LLM agents, (2) what mechanisms current harnesses already build in, and
(3) what should change in this skill as a result.

---

## 1. The research landscape

### 1.1 Foundations (2023–2024): compression and interface design

- **LLMLingua / LongLLMLingua / LLMLingua-2** (Microsoft, [arXiv:2310.05736](https://arxiv.org/abs/2310.05736),
  [arXiv:2310.06839](https://arxiv.org/abs/2310.06839), [arXiv:2403.12968](https://arxiv.org/abs/2403.12968)):
  perplexity-guided prompt compression, up to 20x. LongLLMLingua improved accuracy up to
  21.4% while using ~4x fewer tokens — the first strong evidence that fewer, denser tokens
  *beat* more tokens.
- **SWE-agent** (Princeton, [NeurIPS 2024](https://proceedings.neurips.cc/paper_files/paper/2024/file/5a7c947568c1b1328ccc5230172e1e7c-Paper-Conference.pdf)):
  the "agent-computer interface" paper. A paginated 100-line file viewer and concise search
  results measurably improved resolution rate and cost. Observation formatting is a
  first-class design surface — the direct academic ancestor of this skill's thesis.
- **SWE-Bench+** ([arXiv:2410.06992](https://arxiv.org/abs/2410.06992)): introduced
  cost-per-*resolved*-issue (SWE-Agent+GPT-4: $0.24/instance but $32.50 per actual fix).
- **Prompt caching** (Anthropic, [Aug 2024](https://www.anthropic.com/news/prompt-caching)):
  cache reads at 0.1x input price; up to 90% cost / 85% latency reduction. The economic
  reason agent harnesses keep context append-only.

### 1.2 The 2025–2026 wave: architectural token avoidance

The field's consensus shifted from "compress everything" to *avoiding* tokens architecturally:

- **ACON** (Microsoft, Oct 2025, [arXiv:2510.00615](https://arxiv.org/abs/2510.00615)):
  compressing observations + history cuts peak tokens 26–54% while *improving* success.
- **Context-Folding / FoldAgent** (ByteDance, Oct 2025, [arXiv:2510.11967](https://arxiv.org/abs/2510.11967)):
  fold sub-trajectories into summaries; 58.0% SWE-Bench Verified on a 32K active context
  vs. baselines needing 327K.
- **AgentDiet** (FSE 2026, [arXiv:2509.23586](https://arxiv.org/abs/2509.23586)):
  redundant/expired info is pervasive in coding-agent trajectories; automated removal saves
  39.9–59.7% input tokens at equal performance. Documents crude production truncation
  (Trae Agent: 16KB per tool response).
- **Holistic Agent Leaderboard** (Princeton, Oct 2025, [arXiv:2510.11977](https://arxiv.org/abs/2510.11977)):
  cost-aware agent benchmarking infrastructure; accuracy–cost Pareto frontiers by default.
- **Context as a Tool (CAT)** (Dec 2025, [arXiv:2512.22087](https://arxiv.org/abs/2512.22087)):
  context maintenance as a *callable tool* invoked at milestones, not a passive trigger;
  57.6% SWE-Bench Verified under a bounded budget.
- **Recursive Language Models** (MIT, Dec 2025, [arXiv:2512.24601](https://arxiv.org/abs/2512.24601)):
  the model treats its own context as an environment to peek/grep/slice — the academic
  formalization of "filtered reads instead of full reads."
- **EET** (Jan 2026, [arXiv:2601.05777](https://arxiv.org/pdf/2601.05777)): learn when a
  run is doomed and terminate early — attacks the denominator of cost-per-resolved-issue.
- **SWE-Pruner** (Jan 2026, [arXiv:2601.16746](https://arxiv.org/abs/2601.16746)):
  a 0.6B neural skimmer selects task-relevant code lines; 23–54% token reduction; critiques
  perplexity compressors for breaking code syntax.
- **Agent-Omit** (Feb 2026, [arXiv:2602.04284](https://arxiv.org/abs/2602.04284)):
  RL with an omission reward teaches the agent itself to drop stale observations.
- **Token Economics for LLM Agents** (May 2026, [arXiv:2605.09104](https://arxiv.org/abs/2605.09104)):
  survey framing tokens as the economic primitive of agentic AI; a map of the 2024–26 field.
- **Less Context, Better Agents** (Jun 2026, [arXiv:2606.10209](https://arxiv.org/abs/2606.10209)):
  enterprise case study — last-5-tool-pairs + summarization achieved **91.6% task completion
  at 553K tokens vs 71.0% at 1.48M** with full history. Token efficiency as a quality
  intervention, cleanly measured.
- **TokenPilot** (Jun 2026, [arXiv:2606.17016](https://arxiv.org/html/2606.17016v1)):
  aggressive per-turn truncation mutates the prompt prefix, **shattering KV/prompt-cache
  continuity — cache-invalidation costs can exceed the text savings**. Token minimization
  must be cache-aware.

### 1.3 Industry engineering work

- **Anthropic — Effective context engineering for AI agents** ([Sep 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)):
  "context is a finite resource with diminishing marginal returns"; minimal high-signal
  prompts, just-in-time retrieval via lightweight identifiers, compaction/notes/subagents.
- **Anthropic — context editing + memory** ([Sep 2025](https://www.anthropic.com/news/context-management)):
  server-side clearing of old tool results cut token consumption **84%** in a 100-turn eval;
  editing + memory improved performance 39%.
- **Anthropic — Agent Skills** ([Oct 2025](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills);
  open standard Dec 2025, adopted by Codex, Gemini CLI, Copilot): progressive disclosure —
  metadata-only until invoked; executable scripts beat token generation.
- **Anthropic — Code execution with MCP** ([Nov 2025](https://www.anthropic.com/engineering/code-execution-with-mcp)):
  filtering data in a sandbox before it reaches context: **~150,000 → ~2,000 tokens (98.7%)**
  on a sample workflow.
- **Anthropic — Advanced tool use** ([Nov 2025](https://www.anthropic.com/engineering/advanced-tool-use)):
  Tool Search Tool (77K → 8.7K tokens of tool definitions, ~85%, with *higher* accuracy);
  Programmatic Tool Calling (37% savings, accuracy gains); Tool Use Examples.
- **Anthropic — token-efficient tool use beta** ([Feb 2025](https://www.anthropic.com/news/token-saving-updates)):
  14% avg / up to 70% output-token savings on tool calls; folded into Claude 4+ by default.
- **Manus — Context Engineering lessons** ([Jul 2025](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)):
  KV-cache hit rate is "the single most important metric of a production agent" (10x price
  gap, ~100:1 input:output ratio); append-only prefixes; restorable compression (keep
  paths/URLs, drop content).
- **Cognition/Devin** ([Oct 2025](https://cognition.com/blog/devin-sonnet-4-5-lessons-and-challenges),
  [2026](https://cognition.com/blog/devin-fusion)): "context anxiety" (models behave worse
  when they believe context is short); Devin Fusion switches models only during compaction
  (when the cache miss is free anyway), cutting cost ~35%.
- **Amp retires compaction for Handoff** ([Tessl, 2026](https://tessl.io/blog/amp-retires-compaction-for-a-cleaner-handoff-in-the-coding-agent-context-race/)):
  fresh curated context beats recursive summarization — summaries-of-summaries decay.
- **OpenAI — GPT-5.1-Codex-Max** ([Nov 2025](https://openai.com/index/gpt-5-1-codex-max/)):
  first model natively trained for compaction across context windows; ~30% fewer thinking
  tokens at matched performance.
- **Chroma — Context Rot** ([Jul 2025](https://www.trychroma.com/research/context-rot)):
  18 models degrade non-uniformly as input grows, even on trivial tasks. With
  **NoLiMa** ([arXiv:2502.05167](https://arxiv.org/abs/2502.05167): 11/12 models below 50%
  of baseline at 32K without lexical overlap) and **RULER**
  ([arXiv:2404.06654](https://arxiv.org/abs/2404.06654)): the standard citation set for why
  raw tool-output dumps actively hurt reasoning, not just budgets.

### 1.4 Measurements directly relevant to this skill's claims

- **Reads dominate agent spend**: trace analysis finds read-type operations consume
  **~76% of total agent tokens** ([Milvus, 2026](https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md)) —
  filtered reads are the highest-leverage optimization; validates the skill's core thesis.
- **Formats**: [TOON benchmarks](https://github.com/toon-format/toon) — 39.9% fewer tokens
  than pretty JSON with slightly *higher* retrieval accuracy (76.4% vs 75.0%); plain CSV
  remains smallest for flat tables. The skill's "~40-50% fewer tokens with CSV" holds up.
- **ANSI stripping**: [RTK](https://www.datasops.com/blog/rtk-token-killer) (2026) claims
  60–90% compression of shell output via ANSI stripping + dedup + summarization. No rigorous
  academic measurement of ANSI overhead exists; the skill's "20-30%" figure is unsourced.
- **CLI-before-context filtering**: practitioners report 10–20x context-usage differences
  when filtering happens before data reaches context
  ([Hrishi Digital](https://www.hrishidigital.com.au/blog/cli-vs-mcp-ai-agents/));
  imprecise grep forces repeated confirmatory file opens
  ([Moderne](https://www.moderne.ai/blog/from-grep-to-moderne-trigrep-code-search-for-agents)).

---

## 2. What harnesses already do natively (July 2026)

### Claude Code
- **Output limiting**: Read tool 2,000-line default / 2,000-char line truncation / 256KB
  pre-open cap, with "PARTIAL view" fallback (v2.1.145); Bash output ~30K-char middle
  truncation; Grep `head_limit` default 250; oversized tool results persisted to disk and
  replaced by a preview + path; images downscaled to 2,000px; MCP descriptions capped at 2KB.
- **Compaction, two-tier**: silent **microcompaction** clears old tool results (a cached
  variant does so without invalidating the prompt cache), then LLM summarization near the
  limit (~83.5% threshold, tunable); `/compact` accepts focus instructions; CLAUDE.md can
  carry `# Compact instructions`; re-injected skill bodies capped at 5K tokens/skill, 25K total.
- **Prompt caching**: cache-first request layout, append-only conversation; a dedicated doc
  enumerates cache-safe vs cache-breaking actions; 1-hour TTL on subscriptions; multiple
  2026 changes exist purely to preserve cache (fixed output style at session start, `/cd`
  without cache break, dynamic content removed from tool descriptions).
- **Lazy loading**: MCP Tool Search auto-enables when tool definitions would exceed 10% of
  the window (~85% overhead reduction); built-in tools ship deferred too; Skills load
  metadata-only (~100 tokens each) until invoked; lean system prompt (v2.1.154);
  introspection via `/context`, `/usage`, per-skill token estimates.
- **Subagents**: isolated context windows; only the final message returns (documented
  example: 6,100 tokens read → 420-token result to parent). Costs docs recommend delegating
  verbose operations to subagents, optionally on Haiku.
- **Shipped guidance**: Bash tool description tells the model to avoid `find`, `grep`,
  `cat`, `head`, `tail`, `sed`, `awk`, `echo` in favor of Grep/Glob/Read; Read description
  says not to re-read just-edited files; the
  [costs doc](https://code.claude.com/docs/en/costs) recommends CLIs over MCP servers,
  CLAUDE.md under ~200 lines, hooks to pre-filter output, and moving workflow instructions
  into on-demand skills.

### OpenAI Codex CLI
- Token-budget middle truncation of tool output (`tool_output_token_limit`), replacing the
  old 256-line/10KiB cap; AGENTS.md silently truncated at 32KiB; `/compact` + auto-compact
  with a dedicated remote `/responses/compact` endpoint; strictly linear append-only loop
  for cache hits ("Unrolling the Codex agent loop"); system prompt tells the model to prefer
  `rg`; multi-agent threads with isolated contexts (2026).

### Gemini CLI
- `/compress` + auto-compression at 0.5 of the window (structured XML state snapshot);
  `truncateToolOutputThreshold` 40K chars; optional LLM summarization of shell output with
  per-tool token budgets; new 2026 `contextManagement.*` layer: per-turn retained cap 12K
  tokens, output distillation at 10K/20K, output masking of old tool results past 30K
  prunable tokens; implicit token caching (90% discount) with `/stats` visibility;
  `useRipgrep` default true.

### Cursor
- Auto-summarization near the limit (flash-class model) + `/summarize`; large files included
  as condensed structural outlines expandable on demand; "dynamic context discovery"
  (Jan 2026): long tool outputs become files, agent can search its own chat history to
  recover post-summary details, Agent Skills standard, selective MCP tool loading (−46.9%
  tokens), terminals as files; Composer RL-trained to self-summarize while **reusing the KV
  cache** (~1/5 tokens, half the compaction-induced error).

### OpenCode
- Read tool 2,000 lines / 2,000-char lines / 50KB; grep/glob capped at 100 results; shell
  output truncated at 2,000 lines/50KB with the **full output persisted to disk** and a hint
  to inspect selectively; auto-compaction with reserved buffer; `compaction.prune` clears
  old tool outputs (skill outputs never pruned); plugin ecosystem for dynamic pruning.

### Others
- **Amp**: Handoff instead of compaction; subagents for output-heavy work.
- **Aider**: PageRank repo map under a hard token budget (default 1K tokens);
  `--cache-prompts` with keepalive pings for the 5-minute Anthropic TTL.
- **Cline**: Auto Compact with checkpoint restore; model-aware middle truncation fallback.
- **GitHub Copilot CLI**: background auto-compaction at ~80% of the window with a 20%
  buffer; `/compact`, `/context` (Jan 2026).

### Cross-cutting patterns
1. **Two-tier context management everywhere**: cheap silent tool-output clearing first,
   LLM summarization as a last resort.
2. **Truncate-but-persist**: keep the full artifact on disk, put a preview + path in context.
3. **Cache-shaped architecture**: append-only, stable prefixes, lazy tool schemas —
   justified explicitly by prompt-cache economics.
4. **Lazy everything**: deferred tool schemas and skills progressive disclosure are the
   fastest-moving area.
5. **Subagent isolation is universal**: only the final message crosses back.

---

## 3. What should be updated in this skill

### 3.1 Delivery mechanism (highest priority)

The SessionStart hook injects the full SKILL.md (~1.2K tokens) into **every** session,
re-injecting on `/clear` and `/compact`. This bypasses the progressive disclosure that
skills exist to provide, and it occupies always-on context in exactly the way the skill
tells agents not to. Options:

- Split into a short always-on core (the two questions + 3–4 rules, ~150–250 tokens)
  injected by the hook, with the full SKILL.md left to normal skill activation; or
- Drop the hook for Claude Code entirely and rely on the skill description trigger,
  keeping forced injection only for harnesses without a skills mechanism (the GEMINI.md
  include, the OpenCode plugin — though OpenCode now supports skills natively and the
  plugin inlines full content; worth revisiting).

### 3.2 Reframe: quality first, cost second

The skill's motivation is entirely monetary. The strongest 2025–26 evidence (Context Rot,
NoLiMa, RULER, "Less Context Better Agents": 91.6% vs 71.0% completion at ⅓ the tokens)
shows bloated context degrades *accuracy*. Lead with "every wasted byte makes you dumber,
then poorer." This framing also ages better as token prices fall and supports the README's
sunset thesis.

### 3.3 Add cache-awareness

The skill optimizes bytes-per-call with no mention of prompt-cache economics, yet cached
input is ~10x cheaper and TokenPilot/Manus show byte-minimization that churns context can
cost more than it saves. Add a short section: don't take actions whose purpose is to mutate
prior context; prefer append-only workflows; changing models/config mid-session forfeits
the cache discount.

### 3.4 Defer to harness-native mechanisms

Every major harness now ships filtered-read tools (Read offset/limit, Grep head_limit,
output-mode options), output truncation with disk persistence, and subagent isolation.
The skill should say explicitly: **use the harness's native affordances first** (they
integrate with truncation, permissions, and caching); the bash toolkit (`jq`, `yq`, `rg`,
`awk`) is for data-processing work *inside* Bash and for harnesses/surfaces where native
tools don't reach. Without this, the skill actively contradicts Claude Code's own tool
guidance ("avoid cat/grep/find in Bash — use dedicated tools").

### 3.5 Add missing high-leverage techniques

- **Subagent/context isolation**: delegate verbose operations (test runs, log digging,
  doc fetching) to a subagent; only the conclusion returns. Universally supported and
  absent from the skill.
- **Scripts over token generation**: when output can be computed, write/run a script
  instead of generating file content token-by-token (Anthropic Skills post) — extends the
  existing "coreutils over Python" section from *reading* to *writing*.
- **Truncate-but-persist**: redirect unpredictable output to a file, inspect selectively —
  the skill has this, but should note harnesses now do it automatically, and the pattern of
  keeping restorable references (paths/URLs) rather than content (Manus).

### 3.6 Fix or qualify specific claims

- "Output tokens 2-5x more expensive": roughly right (5x for current Anthropic/OpenAI
  list prices) but should mention the bigger lever — cached vs uncached input is ~10x.
- "Colored output adds 20-30% token overhead": unsourced; keep NO_COLOR advice (it's
  correct and validated by RTK-style tools) but soften or source the number.
- "Batch with `&&`": conflicts with harnesses that prefer parallel independent tool calls
  and with per-command permission gating; qualify (batch only sequential, dependent
  commands; note some harnesses parallelize independent calls at no extra round-trip).
- Hash-based polling (`md5sum`): still valid for raw shells, but modern harnesses have
  background tasks with completion notifications; qualify accordingly.
- The description's "TRIGGER on any computer use whatsoever" fights the skills system's
  relevance matching and, combined with forced injection, is redundant.

### 3.7 README

- The sunset notice is well-supported by this research — harnesses are internalizing these
  practices fast (native compaction training in Codex-Max, Cursor's RL self-summarization,
  Claude Code's deferred tools). Consider linking this document as evidence and defining a
  concrete sunset criterion.
- OpenCode now supports the Agent Skills standard natively; the plugin that inlines full
  skill content may be replaceable with standard skill installation.
