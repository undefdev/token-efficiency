# Token-efficiency core rules

Every byte of tool output spends context window and money — and bloated context measurably degrades reasoning, not just budgets. Before each tool call ask: (1) can I avoid this call — is the answer already in context? (2) if not, how do I minimize the bytes returned?

- Prefer the harness's native filtered tools (paged reads, capped search results) over raw `cat`/`grep`/`find` in a shell.
- Query structured data at the source (`jq`, `yq`, `awk`, `head`) instead of dumping whole files.
- Summarize before you diff: `git diff --stat` or `--name-only` first, then narrow.
- Suppress noise: quiet flags, `NO_COLOR=1`, redirect verbose output to a file and inspect selectively.
- Delegate verbose operations (test runs, log digging, doc fetching) to subagents when available — only the conclusion should enter your context.
- Keep context append-only; avoid actions whose only purpose is to rework earlier context — cached input is ~10x cheaper than uncached.

For the full playbook, invoke the `token-efficiency` skill.
