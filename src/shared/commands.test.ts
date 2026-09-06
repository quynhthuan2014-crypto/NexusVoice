import { describe, expect, it } from 'vitest';
import { calculateExpression, parseCommand } from './commands';

describe('parseCommand', () => {
  it('parses allowlisted sites', () => {
    expect(parseCommand('mở youtube')).toEqual({
      kind: 'open-url',
      url: 'https://www.youtube.com',
      label: 'YouTube',
    });
  });

  it('rejects unknown site commands', () => {
    expect(parseCommand('mở example.com').kind).toBe('unknown');
  });

  it('parses calculator requests', () => {
    expect(parseCommand('tính 2 + 3 * 4')).toEqual({ kind: 'calculate', expression: '2 + 3 * 4' });
  });
});

describe('calculateExpression', () => {
  it('respects operator precedence and parentheses', () => {
    expect(calculateExpression('2 + 3 * (4 - 1)')).toBe(11);
  });

  it('rejects division by zero', () => {
    expect(() => calculateExpression('5 / 0')).toThrow(/chia cho 0/i);
  });

  it('does not execute arbitrary JavaScript', () => {
    expect(() => calculateExpression('process.exit()')).toThrow();
  });
});
