import './style.css';
import { createProvider } from './ai/provider';
import { createVoiceController, speak } from './voice';

type Message = { role: 'assistant' | 'user'; text: string; time: string };

const provider = createProvider({ mode: 'demo' });
const messages: Message[] = [
  { role: 'assistant', text: 'Xin chào! Mình là NexusVoice. Hãy bấm micro hoặc gõ một lệnh.', time: timeNow() },
];
let listening = false;
let voice: ReturnType<typeof createVoiceController>;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root is missing.');

app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">N</div><div><strong>NEXUS</strong><span>VOICE</span></div></div>
      <div class="status"><span class="dot"></span><span>Local voice engine</span></div>
      <nav>
        <button class="nav active">◉ Assistant</button>
        <button class="nav">◌ History</button>
        <button class="nav">⚙ Settings</button>
      </nav>
      <div class="side-note"><b>Privacy-first</b><p>Voice is processed through your browser speech service. No microphone stream is uploaded by this app.</p></div>
    </aside>

    <main class="main">
      <header class="topbar"><div><div class="eyebrow">DESKTOP AI ASSISTANT</div><h1>Talk to NexusVoice</h1></div><span class="mode">● OFFLINE READY</span></header>

      <section class="hero">
        <div class="orb" id="orb"><div class="orb-core">N</div></div>
        <div class="hero-copy"><h2 id="state">Ready to listen</h2><p id="hint">Try “mở YouTube”, “tính 12 * 4”, or “thông tin hệ thống”.</p></div>
      </section>

      <section class="chat" id="chat"></section>

      <div class="composer">
        <input id="command" autocomplete="off" placeholder="Nói hoặc nhập lệnh..." />
        <button id="send" class="send" aria-label="Send">➤</button>
        <button id="mic" class="mic" aria-label="Voice input">🎙</button>
      </div>
      <div class="tips"><span>Examples</span><button data-example="mở YouTube">mở YouTube</button><button data-example="tính 24 / 6">tính 24 / 6</button><button data-example="thông tin hệ thống">system info</button></div>
    </main>
  </div>
`;

const chat = document.querySelector<HTMLDivElement>('#chat')!;
const input = document.querySelector<HTMLInputElement>('#command')!;
const state = document.querySelector<HTMLHeadingElement>('#state')!;
const hint = document.querySelector<HTMLParagraphElement>('#hint')!;
const mic = document.querySelector<HTMLButtonElement>('#mic')!;
const orb = document.querySelector<HTMLDivElement>('#orb')!;

function timeNow() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function render() {
  chat.innerHTML = messages.map((m) => `<div class="message ${m.role}"><div class="bubble">${escapeHtml(m.text)}</div><time>${m.time}</time></div>`).join('');
  chat.scrollTop = chat.scrollHeight;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char));
}

function add(role: Message['role'], text: string) {
  messages.push({ role, text, time: timeNow() });
  render();
}

async function handleCommand(text: string) {
  const clean = text.trim();
  if (!clean) return;
  add('user', clean);
  input.value = '';
  state.textContent = 'Working…';
  const result = await window.nexusVoice.runCommand(clean);
  let response = result.message;
  if (result.ok && clean.toLocaleLowerCase('vi-VN').includes('thông tin hệ thống') && result.data) {
    const data = result.data as Record<string, string>;
    response = `Nền tảng: ${data.platform}\nKiến trúc: ${data.arch}\nHost: ${data.hostname}`;
  }
  if (!result.ok) {
    const ai = await provider.chat([{ role: 'user', content: clean }]);
    response = ai;
  }
  add('assistant', response);
  state.textContent = 'Ready to listen';
  hint.textContent = 'Mình có thể mở web, tính toán và đọc thông tin hệ thống.';
  speak(response);
}

voice = createVoiceController({
  onStart: () => { listening = true; mic.classList.add('recording'); orb.classList.add('listening'); state.textContent = 'Listening…'; hint.textContent = 'Hãy nói một lệnh bằng tiếng Việt.'; },
  onEnd: () => { listening = false; mic.classList.remove('recording'); orb.classList.remove('listening'); },
  onResult: (text) => void handleCommand(text),
  onError: (message) => { listening = false; mic.classList.remove('recording'); orb.classList.remove('listening'); state.textContent = 'Voice unavailable'; hint.textContent = message; },
});

mic.addEventListener('click', () => {
  if (!voice.supported) { hint.textContent = 'Speech Recognition chưa được hỗ trợ trên môi trường hiện tại.'; return; }
  if (listening) voice.stop(); else voice.start();
});

document.querySelector('#send')?.addEventListener('click', () => void handleCommand(input.value));
input.addEventListener('keydown', (event) => { if (event.key === 'Enter') void handleCommand(input.value); });
document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach((button) => button.addEventListener('click', () => void handleCommand(button.dataset.example ?? '')));

render();
