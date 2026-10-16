# Token Efficiency

A skill that helps coding agents reduce token waste in tool use, file reading, and data processing.

Filter and query data before it enters context, while preserving the evidence needed to finish correctly. The goal is lower total cost and time to a verified result, accounting for retries and coordination as well as output size.

> **Sunset notice:** This skill exists because current coding agents haven't yet internalized efficient tool use. As models improve and these practices become default behavior, this skill will be discontinued.

## What it covers

- Structured query tools (`jq`, `yq`, `awk`) over dump-and-read
- Targeted search (`ast-grep`, `rg`) and selective file reads
- Git summaries for broad diffs (`--stat`, `--name-only`)
- Output noise suppression while preserving errors and exit status
- Script-based generation and conditional parallelism or delegation
- Completion notifications and lightweight change detection
- Cache-aware context management with recoverable references

## How it loads

Claude Code and Cursor session hooks inject a short [core checklist](skills/token-efficiency/CORE.md). The [full playbook](skills/token-efficiency/SKILL.md) remains available through skill discovery. Codex uses native skill discovery; the Gemini context include and OpenCode plugin load the full playbook.

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
