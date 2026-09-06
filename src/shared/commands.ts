export type Command =
  | { kind: 'open-url'; url: string; label: string }
  | { kind: 'calculate'; expression: string }
  | { kind: 'system-info' }
  | { kind: 'unknown'; input: string };

const sites: Record<string, { url: string; label: string }> = {
  youtube: { url: 'https://www.youtube.com', label: 'YouTube' },
  google: { url: 'https://www.google.com', label: 'Google' },
  github: { url: 'https://github.com', label: 'GitHub' },
  facebook: { url: 'https://www.facebook.com', label: 'Facebook' },
};

export function parseCommand(raw: string): Command {
  const input = raw.trim();
  const normalized = input.toLocaleLowerCase('vi-VN');

  const site = Object.entries(sites).find(([name]) =>
    new RegExp(`^(?:mở|mo|open)\\s+${name}$`, 'i').test(normalized),
  );
  if (site) {
    return { kind: 'open-url', url: site[1].url, label: site[1].label };
  }

  if (/^(?:thông tin hệ thống|thong tin he thong|system info)$/i.test(normalized)) {
    return { kind: 'system-info' };
  }

  const calcMatch = input.match(/^(?:tính|tinh|calculate|calc)\s+(.+)$/i);
  if (calcMatch?.[1]) {
    const expression = calcMatch[1].trim();
    if (/^[0-9+\-*/().,%\s]+$/.test(expression) && expression.length <= 100) {
      return { kind: 'calculate', expression };
    }
  }

  return { kind: 'unknown', input };
}

export function calculateExpression(expression: string): number {
  const sanitized = expression.replace(/%/g, '/100');
  const tokens = sanitized.match(/\d+(?:\.\d+)?|[+\-*/()]?/g)?.filter(Boolean) ?? [];
  const values: number[] = [];
  const operators: string[] = [];
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

  const applyTop = () => {
    const op = operators.pop();
    const b = values.pop();
    const a = values.pop();
    if (!op || a === undefined || b === undefined) throw new Error('Biểu thức không hợp lệ.');
    if (op === '/' && b === 0) throw new Error('Không thể chia cho 0.');
    const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
    if (!Number.isFinite(result)) throw new Error('Kết quả không hợp lệ.');
    values.push(result);
  };

  for (const token of tokens) {
    if (/^\d/.test(token)) {
      const value = Number(token);
      if (!Number.isFinite(value)) throw new Error('Số không hợp lệ.');
      values.push(value);
      continue;
    }
    if (token === '(') {
      operators.push(token);
      continue;
    }
    if (token === ')') {
      while (operators.at(-1) !== '(') {
        if (!operators.length) throw new Error('Thiếu dấu ngoặc.');
        applyTop();
      }
      operators.pop();
      continue;
    }
    if (token && token in precedence) {
      while (operators.length && operators.at(-1) !== '(' && precedence[operators.at(-1)] >= precedence[token]) {
        applyTop();
      }
      operators.push(token);
      continue;
    }
    throw new Error('Ký tự không được phép trong phép tính.');
  }
  while (operators.length) {
    if (operators.at(-1) === '(') throw new Error('Thiếu dấu ngoặc đóng.');
    applyTop();
  }
  if (values.length !== 1) throw new Error('Biểu thức không hợp lệ.');
  return values[0];
}
