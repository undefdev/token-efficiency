---
name: token-efficiency
description: Reduce token waste when reading or searching files, querying structured data, inspecting diffs, or handling verbose tool output.
---

# Token-Efficient Computer Use

Optimize total cost and time to a verified result. Smaller outputs help when they preserve the evidence needed to finish correctly; extra searches, retries, and coordination can erase the savings.

Before a tool call, ask whether current evidence already answers the question and what information the next decision actually needs.

## Read selectively and expand when needed

- Use available filtered reads and searches that fit the task and the harness's tool guidance. Use shell pipelines for data transformations and queries the native tools do not cover.
- Locate files or symbols with filenames, counts, or bounded matches, then read relevant spans and dependencies. Expand when the result is ambiguous. A capped or truncated search does not establish that other matches are absent.
- Use AST search for structural code patterns and text search for literals, configuration, or logs. Do not install a new search tool unless repeated use justifies the setup.
- `rg` recurses by default. Its `-r` flag means `--replace`, not recursion. Its `-m` match limit applies per file, not across the entire search.
- For broad Git changes, start with `git diff --stat` or `--name-only`, then inspect relevant files. Read a small, targeted diff directly.

## Query and generate at the source

- Project JSON with `jq`; use format-aware tools for YAML, TOML, and XML. Check which `yq` implementation is installed before relying on its options.
- Use `cut` or `awk` for simple delimited text; use a CSV-aware parser for quoted fields or embedded newlines. Choose a compact format that preserves the data's structure.
- Generate repetitive content, conversions, and mechanical edits with a short script when that is simpler and more reliable than emitting the result manually. Choose the language for correctness, not a blanket preference for shell or Python.

## Reduce noise without losing evidence

- Use quiet flags and disable color where supported, while retaining failure diagnostics.
- Save unpredictable or verbose output to a file and inspect relevant sections. Reuse output the harness already persisted instead of rerunning the command solely to recover it.
- Preserve the original command's exit status when capturing or piping output; a successful formatter does not prove the command succeeded.
- Retain exact errors, relevant constraints, failed approaches, and paths or URLs needed to recover details. Recheck evidence when the underlying state changes.

## Account for execution overhead

- Run independent calls in parallel when supported and permitted. Chain dependent commands with `&&` when useful, keeping approval boundaries clear.
- Prefer completion notifications to polling. If polling is necessary, use metadata or hashes when they answer the question more cheaply than rereading the content.
- Delegate substantial, separable work when isolation or parallelism justifies setup and coordination. A smaller parent context does not imply lower total cost: include child-agent usage, and request conclusions with references to supporting evidence.

## Preserve useful context and cache reuse

Keep prompt prefixes stable where practical and avoid unnecessary changes to prompt-affecting configuration. Cache behavior and pricing depend on the provider and model.

Use the harness's compaction or context-management mechanisms when needed. Preserve the task's constraints, verified findings, failed attempts, next steps, and references to recoverable details. Judge context reduction by subsequent correctness, retries, total cost, and latency.
