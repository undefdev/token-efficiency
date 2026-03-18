# Token Efficiency

A skill that teaches coding agents to minimize token waste in all tool use, file reading, and data processing operations.

Every byte of tool output is money and context window spent. This skill instills the habit of filtering, projecting, and truncating at the source — not dumping raw output and hoping for the best.

> **Sunset notice:** This skill exists because current coding agents haven't yet internalized efficient tool use. As models improve and these practices become default behavior, this skill will be discontinued.

## What it covers

- Structured query tools (`jq`, `yq`, `awk`) over dump-and-read
- Precision search (`ast-grep`, `rg`) over broad text search
- Git summary-first workflows (`--stat`, `--name-only`)
- Output noise suppression (quiet flags, `NO_COLOR`, selective reads)
- Hash-based change detection over re-reading files
- Coreutils over Python for simple transforms

## Installation

### Claude Code

```
/plugin marketplace add undefdev/token-efficiency
/plugin install token-efficiency@undefdev-token-efficiency
```

### Cursor

```
/add-plugin token-efficiency
```

### Gemini CLI

```bash
gemini extensions install https://github.com/undefdev/token-efficiency
```

### Codex

See [.codex/INSTALL.md](.codex/INSTALL.md)

### OpenCode

See [.opencode/INSTALL.md](.opencode/INSTALL.md)
