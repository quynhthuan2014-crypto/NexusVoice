export {};

declare global {
  interface Window {
    nexusVoice: {
      openUrl: (url: string) => Promise<{ ok: boolean; message: string }>;
      runCommand: (text: string) => Promise<{ ok: boolean; message: string; data?: unknown }>;
      getSystemInfo: () => Promise<Record<string, string>>;
    };
  }
}
