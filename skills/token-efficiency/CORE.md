# Token-efficiency core rules

Minimize total cost and time to a verified result.

- Reuse current evidence; retrieve only what the next decision needs.
- Filter and query before output enters context. Follow the harness's tool guidance.
- Preserve relevant errors and constraints. Expand incomplete or ambiguous reads.
- Save verbose output for selective inspection, preserving the command's exit status.
- Include setup, retries, and child-agent usage when judging savings.
- Keep prompt prefixes stable where practical; use native context management when needed.

For the full playbook, invoke the `token-efficiency` skill.
