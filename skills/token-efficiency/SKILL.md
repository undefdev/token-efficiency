---
name: token-efficiency
description: >
  Minimize token waste and context bloat in bash, file, and data-processing operations.
  Apply when executing shell commands, reading or searching files or code, processing
  structured data (JSON/YAML/CSV/logs), inspecting diffs, or handling verbose tool output.
  Covers filtered reads, structured query tools, output suppression, subagent delegation,
  script-based generation, and prompt-cache-friendly workflows.
---

# Token-Efficient Computer Use

Every character of stdout returned from a tool call gets tokenized, billed, and — worse — occupies attention. Long-context research is unambiguous: model performance degrades as context fills, even on simple tasks, and irrelevant tool output is the most disposable content in an agent's context. A single careless `cat` on a 2000-line JSON file doesn't just cost money; it makes every subsequent reasoning step slightly worse. Two questions should precede every tool call:

1. **Can I avoid this call entirely?** If the information is already in context from a previous read or from the user, use it.
2. **If I must call, how do I minimize the bytes returned?** Filter, project, truncate, or count at the source rather than dumping raw output.

On the cost side, two multipliers matter: output tokens are typically ~5x more expensive than input tokens, and *uncached* input is ~10x more expensive than cached input. This doesn't mean cutting corners on reasoning — think as much as you need to. It means don't generate bytes a tool could produce, and don't churn context the cache has already paid for.

---

## Use the harness's native tools first

Modern agent harnesses ship filtered-read affordances: paged file reads (offset/limit), search tools with result caps and files-only/count-only modes, automatic truncation that persists full output to disk. These integrate with the harness's permission system, truncation limits, and prompt cache — prefer them over raw `cat`/`grep`/`find` in a shell. Claude Code, for example, explicitly instructs against `cat`, `grep`, `find`, `head`, `tail`, `sed`, and `awk` for file access and search, in favor of its Read/Grep/Glob tools.

The shell toolkit below is for what native tools don't cover: transforming and querying data *within* a command pipeline, and harnesses or remote shells without filtered-read tools.

---

## Use structured query tools, not dump-and-read

The single biggest source of token waste is printing an entire structured file to extract a few fields. Structured data has purpose-built query tools that return only what you ask for:

**JSON → `jq`**: A `curl` response piped through `jq '.data[] | {id, status}'` might return 200 bytes where the raw payload was 15KB. This applies to any JSON — API responses, config files, build manifests. If you're reaching for `python -c "import json; ..."`, use `jq` instead. Use `jq -c` for compact single-line output when you don't need readability.

**YAML/TOML/XML → `yq`**: Same principle. `yq '.services | keys' docker-compose.yml` returns a short list where `cat` returns the entire file. Handles TOML and XML too (`-p toml`, `-p xml`).

**CSV/TSV → `awk`, `cut`, `head`**: Use `head -n 6` to peek at structure, `cut` to project columns, `awk` for aggregation. Prefer CSV over JSON for tabular output when you control the format — benchmarks show ~40% fewer tokens than pretty-printed JSON, with no loss in model comprehension.

The general principle: if a format has a query language or projection tool, use it. This extends to databases (`sqlite3` with a SELECT), parquet files (`duckdb`), etc.

---

## Prefer precision search tools

Broad text search produces noisy results, leading to a costly loop: search → read file → wrong match → search again. Precision tools short-circuit this:

**`ast-grep`** searches by AST pattern — one call replaces 3-5 rounds of text search + file reads. First choice for code search when the harness's native search isn't semantic enough.

**`rg` (ripgrep)** is the right tool for text/config/log search in a shell. Its key token-saving feature is output limiting: filenames only (`-l`), counts only (`-c`), or capped matches (`-m`) — getting the answer without the content. It recurses by default, so don't add `-r` expecting `grep`-style recursion: in `rg`, `-r` means `--replace` and eats your pattern as the replacement string.

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

**Disable color.** Set `NO_COLOR=1` as an environment variable or use `--no-color` flags. ANSI escape codes are pure token waste with zero semantic value to a model.

**Redirect and inspect selectively.** For commands with unpredictable output volume, redirect to a temp file, check the size with `wc -l`, then read only the relevant parts. (Many harnesses now do this automatically — truncating output in context while persisting the full artifact to disk. Work with that: read the saved file selectively instead of re-running the command.)

**Chain dependent commands.** Sequential, dependent commands chained with `&&` cost one round-trip instead of several. Don't over-batch, though: keep *independent* commands separate when the harness can run tool calls in parallel, and when combining commands would turn a fine-grained permission decision into an opaque blob.

---

## Delegate verbose work to subagents

Most harnesses support subagents with isolated context windows where only the final message returns to you. This is the strongest context-isolation mechanism available: a subagent can read 50KB of test output or crawl a documentation site, and your context receives a two-sentence conclusion. Delegate operations that are output-heavy and whose intermediate content you won't need again — test runs, log digging, broad exploratory searches, doc fetching. Keep in your own context only what you'll act on.

---

## Generate with scripts, not tokens

Output tokens are the expensive direction. If content can be computed — boilerplate, repetitive structures, format conversions, bulk edits — write a short script and run it rather than generating the result token by token. A 10-line generator script that emits 500 lines costs a fraction of emitting those 500 lines yourself, and only the script's (suppressible) output enters context. The same logic favors `sed -i` for mechanical multi-site edits over rewriting a file by hand.

---

## Track changes with hashes, not re-reads

When you must poll for a file change in a raw shell, compare hashes instead of re-reading — the output is a few bytes regardless of file size:

```bash
md5sum output.json > /tmp/prev.md5
# ... poll ...
md5sum -c /tmp/prev.md5 --quiet 2>/dev/null && echo "unchanged" || echo "changed"
```

This extends to directories with `find ... -exec md5sum {} + | sort` compared against a saved snapshot. But check for a better primitive first: modern harnesses run long commands as background tasks with completion notifications, which beats any polling loop on both tokens and latency.

---

## Prefer coreutils over Python for simple transforms

If the transform is a single pipeline stage — filter, project, count, replace, sort — coreutils are both shorter to write and produce less output than equivalent Python. `wc -l` vs `python -c "print(len(open('f').readlines()))"`. `sed 's/old/new/g'` vs a Python regex one-liner. Reach for Python when you need multi-step logic, data structures, or libraries.

---

## Don't fight the prompt cache

Agent conversations are append-only prompts, and cached input costs ~10x less than uncached. Byte-shaving that mutates earlier context is a false economy: production measurements show cache-invalidation costs can exceed the savings from the removed text. Practical rules:

- Work forward. Never take an action whose only purpose is to reorganize or rewrite earlier context.
- Prefer restorable references over content: keep a file path or URL in context and re-fetch on demand, rather than holding large content "just in case."
- Avoid mid-session churn of configuration the harness bakes into the prompt prefix (model, tool set, connected servers) unless the switch is worth a full cache miss.
- Let the harness's own compaction and tool-result clearing do their job — they're built to preserve cache continuity; ad-hoc manual workarounds usually aren't.
