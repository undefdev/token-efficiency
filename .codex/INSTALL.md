# Installing Token Efficiency for Codex

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tarek-sabet/token-efficiency.git ~/.codex/token-efficiency
   ```

2. **Create the skills symlink:**
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/token-efficiency/skills ~/.agents/skills/token-efficiency
   ```

3. **Restart Codex** to discover the skills.

## Updating

```bash
cd ~/.codex/token-efficiency && git pull
```

## Uninstalling

```bash
rm ~/.agents/skills/token-efficiency
rm -rf ~/.codex/token-efficiency
```
