import { contextBridge, ipcRenderer } from 'electron';

const api = {
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url) as Promise<{ ok: boolean; message: string }>,
  runCommand: (text: string) => ipcRenderer.invoke('run-command', text) as Promise<{ ok: boolean; message: string; data?: unknown }>,
  getSystemInfo: () => ipcRenderer.invoke('system-info') as Promise<Record<string, string>>,
};

contextBridge.exposeInMainWorld('nexusVoice', api);

declare global {
  interface Window {
    nexusVoice: typeof api;
  }
}
