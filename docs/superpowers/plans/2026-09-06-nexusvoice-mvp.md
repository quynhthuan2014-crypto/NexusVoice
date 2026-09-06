# NexusVoice MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Electron desktop voice assistant with local speech recognition, text-to-speech, safe command execution, optional AI-provider integration, and tests.

**Architecture:** The Electron main process owns privileged operations behind a small preload bridge. The renderer provides the voice UI and uses browser speech APIs where available. Commands are parsed into an allowlisted tool registry; AI is an optional provider adapter and never receives machine credentials by default.

**Tech Stack:** Electron, TypeScript, Vite, Vitest, vanilla HTML/CSS/TS, electron-builder, GitHub Actions.

**Spec:** NexusVoice MVP design approved in conversation.

## Global Constraints

- No hard-coded API keys or secrets.
- Renderer must not receive Node.js integration.
- Tool execution must be explicit and allowlisted.
- The application must start in local/offline mode without an AI key.
- Tests must cover command parsing and security allowlisting.

---

### Task 1: Project foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `.github/workflows/ci.yml`

**Interfaces:** Provides build, test, and packaging scripts for later tasks.

- [ ] **Step 1: Write foundation configuration.**
- [ ] **Step 2: Run `npm install` and `npm test` after source files exist.**
- [ ] **Step 3: Verify TypeScript build and Vite production build.**

### Task 2: Secure Electron bridge and command tools

**Files:**
- Create: `electron/main.ts`
- Create: `electron/preload.ts`
- Create: `src/shared/commands.ts`
- Create: `src/shared/commands.test.ts`

**Interfaces:** `window.nexusVoice.openUrl(url)`, `window.nexusVoice.getSystemInfo()`, `window.nexusVoice.runCommand(text)`.

- [ ] **Step 1: Add failing tests for URL allowlisting and command parsing.**
- [ ] **Step 2: Implement allowlisted parsing and tool routing.**
- [ ] **Step 3: Add secure Electron BrowserWindow configuration.**
- [ ] **Step 4: Run targeted tests and type-check.**

### Task 3: Voice UI

**Files:**
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/style.css`
- Create: `src/voice.ts`

**Interfaces:** UI can start/stop recognition, show transcript, speak responses, and dispatch commands through the preload bridge.

- [ ] **Step 1: Implement polished desktop UI.**
- [ ] **Step 2: Add SpeechRecognition capability detection and graceful fallback.**
- [ ] **Step 3: Add speech synthesis controls.**
- [ ] **Step 4: Run production build.**

### Task 4: Optional AI provider adapter

**Files:**
- Create: `src/ai/provider.ts`
- Create: `src/ai/demo-provider.ts`
- Create: `src/ai/openai-compatible-provider.ts`
- Create: `src/ai/provider.test.ts`

**Interfaces:** `AIProvider.chat(messages): Promise<string>` and `createProvider(settings)`.

- [ ] **Step 1: Add provider tests.**
- [ ] **Step 2: Implement deterministic offline provider.**
- [ ] **Step 3: Implement optional OpenAI-compatible HTTP adapter using runtime-provided endpoint/key.**
- [ ] **Step 4: Ensure missing credentials never block startup.**

### Task 5: Documentation and verification

**Files:**
- Create: `README.md`
- Create: `SECURITY.md`
- Create: `LICENSE`

- [ ] **Step 1: Document install, run, build, capabilities, browser speech support, and provider configuration.**
- [ ] **Step 2: Run test suite, type-check, and production build.**
- [ ] **Step 3: Inspect the Git tree and verify no secrets or generated artifacts were committed.**
- [ ] **Step 4: Commit the verified implementation.**
