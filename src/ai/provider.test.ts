import { describe, expect, it } from 'vitest';
import { createProvider } from './provider';

describe('AI providers', () => {
  it('falls back to offline mode without credentials', async () => {
    const provider = createProvider({ mode: 'openai-compatible' });
    expect(provider.name).toContain('Offline');
    await expect(provider.chat([{ role: 'user', content: 'Xin chào' }])).resolves.toContain('Offline');
  });
});
