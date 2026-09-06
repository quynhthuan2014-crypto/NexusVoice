# 🎙️ NexusVoice

> A privacy-conscious desktop voice assistant built with Electron, TypeScript, and Vite.

NexusVoice turns natural speech into a small set of explicit, allowlisted desktop actions. It can work without an external AI service and includes a provider adapter for OpenAI-compatible endpoints.

## ✨ Features

- 🎤 Speech Recognition with graceful browser/Chromium fallback
- 🔊 Vietnamese Text-to-Speech via Web Speech API
- 🌐 Safe web launcher for an allowlisted set of sites
- 🧮 Calculator without `eval()` or arbitrary JavaScript execution
- 💻 System information tool
- 🤖 Offline assistant fallback
- 🔌 Optional OpenAI-compatible provider adapter
- 🔐 Electron isolation: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- 📦 Windows NSIS, macOS DMG, and Linux AppImage packaging configuration
- ✅ Vitest tests + TypeScript type-check + GitHub Actions CI

## 🖥️ Run

Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm test
npm run typecheck
npm run dev
```

Production build:

```bash
npm run build
```

Installer build:

```bash
npm run dist
```

## 🎙️ Example commands

Try:

```text
mở YouTube
mở GitHub
tính 24 / 6
thông tin hệ thống
```

The current command router intentionally rejects unknown executable/system commands. This is a safety boundary, not a limitation to bypass.

## 🧠 AI provider

The app starts in offline mode. The optional OpenAI-compatible adapter expects runtime configuration for an endpoint, model, and API key. Do not commit credentials to this repository. A production release should keep provider credentials in the operating system's secure credential store.

## 🔒 Security model

The renderer has no direct Node.js access. Privileged operations are exposed through a minimal preload bridge and routed through explicit IPC handlers. URL opening accepts only `http:` and `https:` schemes, and the calculator accepts only numeric arithmetic characters.

NexusVoice does not include background keylogging, hidden processes, administrator elevation, or arbitrary shell execution.

## 📁 Project structure

```text
NexusVoice/
├── electron/
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── ai/
│   ├── shared/
│   ├── main.ts
│   ├── voice.ts
│   └── style.css
├── tests via Vitest (*.test.ts)
├── docs/superpowers/plans/
└── .github/workflows/ci.yml
```

## 🗺️ Roadmap

- Wake-word support
- More desktop tools behind per-tool permissions
- Secure credential storage
- Streaming AI responses
- Local speech models
- Signed release artifacts

## License

This project uses the repository's source-available license terms in `LICENSE`.
