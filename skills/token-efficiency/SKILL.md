---
name: token-efficiency
description: >
  Minimize token waste in all bash, file, and data processing operations.
  ALWAYS apply these principles whenever executing commands, reading files, or processing output.
  This skill governs how an LLM agent interacts with the system — it applies to every task involving tool use, file reading, data processing, or shell commands.
  TRIGGER on any computer use whatsoever.
---

# Token-Efficient Computer Use

Every character of stdout returned from a tool call gets tokenized and billed. A single careless `cat` on a 2000-line JSON file costs as much as a thoughtful conversation turn. The goal isn't to memorize specific commands — it's to internalize a simple cost model: **each byte of tool output is money and context window spent**, and each tool call has fixed round-trip overhead on top of that. Two questions should precede every tool call:

1. **Can I avoid this call entirely?** If the information is already in context from a previous read or from the user, use it.
2. **If I must call, how do I minimize the bytes returned?** Filter, project, truncate, or count at the source rather than dumping raw output.

A related cost: output tokens are typically 2-5x more expensive than input tokens (varies by model). This doesn't mean you should cut corners on reasoning or planning — think as much as you need to. But if you're writing a file character by character that a tool could generate, or writing a long Python script to do what a shell one-liner could, you're paying a multiple for unnecessary verbosity.

---

## Use structured query tools, not dump-and-read

The single biggest source of token waste is printing an entire structured file to extract a few fields. Structured data has purpose-built query tools that return only what you ask for:

**JSON → `jq`**: A `curl` response piped through `jq '.data[] | {id, status}'` might return 200 bytes where the raw payload was 15KB. This applies to any JSON — API responses, config files, build manifests. If you're reaching for `python -c "import json; ..."`, use `jq` instead. Use `jq -c` for compact single-line output when you don't need readability.

**YAML/TOML/XML → `yq`**: Same principle. `yq '.services | keys' docker-compose.yml` returns a short list where `cat` returns the entire file. Handles TOML and XML too (`-p toml`, `-p xml`).

**CSV/TSV → `awk`, `cut`, `head`**: Use `head -n 6` to peek at structure, `cut` to project columns, `awk` for aggregation. Prefer CSV over JSON for tabular output when you control the format — ~40-50% fewer tokens.

The general principle: if a format has a query language or projection tool, use it. This extends to databases (`sqlite3` with a SELECT), parquet files (`duckdb`), etc.

---

## Prefer precision search tools

Broad text search produces noisy results, leading to a costly loop: search → read file → wrong match → search again. Precision tools short-circuit this:

**`ast-grep`** searches by AST pattern — one call replaces 3-5 rounds of text search + file reads. First choice for code search.

**`rg` (ripgrep)** is the right tool for text/config/log search. Its key token-saving feature is output limiting: filenames only, counts only, or capped matches — getting the answer without the content.

Install precision tools when the task involves repeated codebase interaction. For a one-off, coreutils are fine — but suppress install output, since installers are extremely noisy.

---

## Git: summarize before you diff

`git diff` on a multi-file change easily dumps thousands of lines into context. Start with a summary and then selectively inspect:

```bash
git diff --stat                    # which files changed and by how much
git diff -- path/to/specific.py   # only the file you care about
git diff --name-only               # just filenames
```

The same applies to `git show`, `git log -p`, and any diff-producing command. Default to `--stat` or `--name-only` first, then narrow down to the files that matter.

---

## Suppress output noise at the source

The default verbosity of most tools exists for interactive human use. Agents rarely need it.

**Use quiet/silent flags.** `-q` for pip/pytest, `--silent` for npm, `-s` for make, `--oneline` for git log. Know what you need from the output and ask for only that.

**Disable color.** Set `NO_COLOR=1` as an environment variable or use `--no-color` flags. Colored output adds 20-30% token overhead from ANSI escape codes.

**Redirect and inspect selectively.** For commands with unpredictable output volume, redirect to a temp file, check the size with `wc -l`, then read only the relevant parts.

**Batch with `&&`.** Each tool call has fixed round-trip overhead. Three commands chained with `&&` cost one round-trip instead of three.

---

## Track changes with hashes, not re-reads

Agents often poll files waiting for builds, server output, or code generation to complete. Re-reading the file each time wastes tokens when it hasn't changed. Compare hashes instead — the output is a few bytes regardless of file size:

```bash
md5sum output.json > /tmp/prev.md5
# ... poll ...
md5sum -c /tmp/prev.md5 --quiet 2>/dev/null && echo "unchanged" || echo "changed"
```

This extends to directories with `find ... -exec md5sum {} + | sort` compared against a saved snapshot.

---

## Prefer coreutils over Python for simple transforms

If the transform is a single pipeline stage — filter, project, count, replace, sort — coreutils are both shorter to write and produce less output than equivalent Python. `wc -l` vs `python -c "print(len(open('f').readlines()))"`. `sed 's/old/new/g'` vs a Python regex one-liner. Reach for Python when you need multi-step logic, data structures, or libraries.