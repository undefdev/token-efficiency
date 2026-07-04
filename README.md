# Token Efficiency

A skill that teaches coding agents to minimize token waste in all tool use, file reading, and data processing operations.

Every byte of tool output is money and context window spent. This skill instills the habit of filtering, projecting, and truncating at the source — not dumping raw output and hoping for the best.

> **Sunset notice:** This skill exists because current coding agents haven't yet internalized efficient tool use. As models improve and these practices become default behavior, this skill will be discontinued. Harnesses are internalizing them fast — see [docs/research-2026-07.md](docs/research-2026-07.md) for a survey of the research and of what harnesses now do natively (compaction, deferred tool loading, output truncation, subagent isolation).

## What it covers

- Harness-native filtered tools first; the shell toolkit where they don't reach
- Structured query tools (`jq`, `yq`, `awk`) over dump-and-read
- Precision search (`ast-grep`, `rg`) over broad text search
- Git summary-first workflows (`--stat`, `--name-only`)
- Output noise suppression (quiet flags, `NO_COLOR`, selective reads)
- Delegating verbose operations (tests, logs, doc fetching) to subagents
- Generating repetitive content with scripts instead of output tokens
- Hash-based change detection over re-reading files
- Coreutils over Python for simple transforms
- Prompt-cache-friendly workflows (append-only context, restorable references)

## How it loads

Two tiers, practicing what it preaches: a SessionStart hook injects only a compact
core of rules ([skills/token-efficiency/CORE.md](skills/token-efficiency/CORE.md),
~200 tokens) into each session, while the full playbook
([skills/token-efficiency/SKILL.md](skills/token-efficiency/SKILL.md)) loads on
demand through the harness's skill mechanism. Harnesses without progressive
disclosure (e.g. the Gemini CLI context-file install) still load the full skill.

## Installation

### Claude Code

First, add the marketplace:
```
/plugin marketplace add undefdev/token-efficiency
```

Then install:
```
/plugin install token-efficiency@undefdev-token-efficiency
```

### Cursor

Not yet available on the Cursor Marketplace. For now, clone the repo and add the skill content to your project's rules manually.

### Gemini CLI

```bash
gemini extensions install https://github.com/undefdev/token-efficiency
```

### Codex

See [.codex/INSTALL.md](.codex/INSTALL.md)

### OpenCode

See [.opencode/INSTALL.md](.opencode/INSTALL.md)
