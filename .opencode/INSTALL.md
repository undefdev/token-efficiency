# Installing Token Efficiency for OpenCode

## Installation

Add token-efficiency to the `plugin` array in your `opencode.json`:

```json
{
  "plugin": ["token-efficiency@git+https://github.com/tarek-sabet/token-efficiency.git"]
}
```

Restart OpenCode.

## Updating

Restarts automatically pull the latest version. To pin a version:

```json
{
  "plugin": ["token-efficiency@git+https://github.com/tarek-sabet/token-efficiency.git#v1.0.0"]
}
```

## Uninstalling

Remove the plugin line from `opencode.json` and restart.
