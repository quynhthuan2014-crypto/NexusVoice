# Security

## Design principles

NexusVoice follows a permission-first model. The renderer is isolated from Node.js and privileged operations are exposed only through a small preload bridge.

## Never commit secrets

Do not commit `.env` files, API keys, tokens, passwords, or private certificates. Use local environment/configuration or the operating system's secure credential facilities.

## Tool boundary

The MVP deliberately supports a small allowlist: opening selected web sites, safe arithmetic, and read-only system information. It does not provide arbitrary shell execution.

## Reporting a vulnerability

Please open a private security report through GitHub's supported security reporting features when available. Do not publish an API key or other sensitive data in a public issue.
