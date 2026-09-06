export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export interface AIProvider {
  name: string;
  chat(messages: ChatMessage[]): Promise<string>;
}

export type ProviderSettings = {
  mode: 'demo' | 'openai-compatible';
  endpoint?: string;
  model?: string;
  apiKey?: string;
};

export function createProvider(settings: ProviderSettings): AIProvider {
  if (settings.mode === 'openai-compatible' && settings.endpoint && settings.model && settings.apiKey) {
    return {
      name: `OpenAI-compatible: ${settings.model}`,
      async chat(messages) {
        const response = await fetch(`${settings.endpoint.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.apiKey}`,
          },
          body: JSON.stringify({ model: settings.model, messages, temperature: 0.4 }),
        });
        if (!response.ok) throw new Error(`AI provider HTTP ${response.status}`);
        const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error('AI provider returned no message.');
        return text;
      },
    };
  }

  return {
    name: 'NexusVoice Offline',
    async chat(messages) {
      const last = messages.at(-1)?.content ?? '';
      return `Mình đang ở chế độ Offline. Bạn vừa nói: “${last}”. Hãy thử lệnh “mở YouTube”, “tính 12 * 4” hoặc “thông tin hệ thống”.`;
    },
  };
}
